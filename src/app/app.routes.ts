import { Routes } from '@angular/router';
import { CharactersListComponent } from './pages/characters-list/characters-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CharacterDetailsComponent } from './pages/character-details/character-details.component';

export const routes: Routes = [
  { path: 'list', component: CharactersListComponent },
  { path: 'details/:id', component: CharacterDetailsComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];
