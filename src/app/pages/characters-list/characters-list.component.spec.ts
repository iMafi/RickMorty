import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { CharactersListComponent } from './characters-list.component';
import {of, throwError} from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import {ReactiveFormsModule} from "@angular/forms";

describe('CharactersListComponent', () => {
  let component: CharactersListComponent;
  let fixture: ComponentFixture<CharactersListComponent>;
  let characterServiceMock = {
    getAllCharacters: (params?: string) => of({
      info: {
        prev: 'http://test.com?prev',
        next: 'http://test.com?next',
        pages: 5
      },
      results: [
        { id: 1, name: 'Rick', status: 'Alive', origin: { name: 'Earth', url: ''}, image: '', species: '' },
        { id: 2, name: 'Morty'}
      ]
    })
  }
  let initialState = {
    loading: true
  }
  let toastrMock = { error: (msg: string, title: string) => {}};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersListComponent, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: CharactersService, useValue: characterServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharactersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.pageParams.next).toEqual('next');
    expect(component.pageParams.prev).toEqual('prev');
    expect(component.pageParams.pages).toEqual(5);
    expect(component.charList).toContain({ id: 1, name: 'Rick', status: 'Alive', origin: { name: 'Earth', url: ''}, image: '', species: '' });
    expect(component.charList.length).toBe(2);
  }));

  it('should handle error', fakeAsync(() => {
    spyOn(characterServiceMock, 'getAllCharacters').and.returnValue(throwError(() => ({error: {error: 'Error'}})));
    spyOn(toastrMock, 'error');
    component.ngOnInit();
    tick();
    expect(toastrMock.error).toHaveBeenCalledWith('Error', 'Error');
  }));

  it('should correctly perform search', fakeAsync(() => {
    spyOn(characterServiceMock, 'getAllCharacters').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = fixture.debugElement.nativeElement.querySelector('#searchByName');
      input.value = 'Rick';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(characterServiceMock.getAllCharacters).toHaveBeenCalledWith('name=Rick');
    });
  }));

  it('should navigate by list correctly', fakeAsync(() => {
    spyOn(characterServiceMock, 'getAllCharacters').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const navBtn = fixture.debugElement.nativeElement.getElementsByClassName('navigation-btn')[0];
      navBtn.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(characterServiceMock.getAllCharacters).toHaveBeenCalledWith('page=5');
    });
  }));
});
