import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CharacterDetailsComponent } from './character-details.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';

describe('CharacterDetailsComponent', () => {
  let component: CharacterDetailsComponent;
  let fixture: ComponentFixture<CharacterDetailsComponent>;
  let routeMock = {
    snapshot: {
      params: {
        id: 1
      }
    }
  };
  let characterServiceMock = {
    getCharacter: (id: number) => of({ id, name: 'Rick', origin: { name: 'Mock'}})
  }
  let toastrMock = { error: (msg: string, title: string) => {}};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: CharactersService, useValue: characterServiceMock },
        { provide: ToastrService, useValue: toastrMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', fakeAsync(() => {
    spyOn(characterServiceMock, 'getCharacter').and.callThrough();
    component.ngOnInit();
    tick();
    expect(characterServiceMock.getCharacter).toHaveBeenCalledWith(1);
    expect(component.character.name).toEqual('Rick');
  }));

  it('should correctly handle toggle', () => {
    expect(component.infoBtnText).toEqual('Show More Info');
    component.toggleInfo();
    expect(component.infoBtnText).toEqual('Hide More Info');
    expect(component.showInfo).toBeTruthy();
  });

  it('should handle error', fakeAsync(() => {
    spyOn(characterServiceMock, 'getCharacter').and.returnValue(throwError(() => ({error: {error: 'Error'}})));
    spyOn(toastrMock, 'error');
    component.ngOnInit();
    tick();
    expect(toastrMock.error).toHaveBeenCalledWith('Error', 'Error');
  }));
});
