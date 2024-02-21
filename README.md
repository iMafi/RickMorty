# RickMorty

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Notes
A few notes and thoughts behind approach to task:
1. I've tried to use different approaches in some places to showcase some possibilities that tasks can be done with
2. I didn't use any ChangeDetection manipulations here since it's simple application and doesn't rely much on Inputs/Outputs.
 So change detection manipulation won't provide much benefit
3. For search input I used FormBuilder just because I wanted to use Reactive Forms in application and automatic search. 
 For single inputs it would be better to use simple ngModel and from UX probably better to use button click to trigger search.
 But I've already have button clicks handler in application and wanted to use something different
4. This application could be easily managed without any state management solution such as NgRx Store, but I decided to implement
  simple store anyway for managing loading state
5. I didn't want to use any @Effects there since I have only simple API calls and I prefer to use them directly from services in components.
6. I planned to add additional functionality in application with character-card.component but didn't have time to implement it. That's why 
  it is simple presentation component right now. In current application state character-details.component can easily manage 
  all presentation that card component does, based on different inputs.
7. Additional libraries used - only ngx-toastr to show error message popups
8. Also added some simple unit tests for testing request/clicks/simple scenarios in application
