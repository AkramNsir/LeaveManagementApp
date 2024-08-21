import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'leave-management-app';

  isToggled: boolean = false;

  addActiveClass() {
    this.isToggled = true;
  }

  removeActiveClass() {
    this.isToggled = false;
  }

  hello() {
    alert('hello')
  }
  SUpButtonOptions = {
    text: "Sign Up",
    // onClick: function() {
    //     const validationResult = formInstance.validate(); // get Form instance beforehand
    //     if (validationResult.isValid)
    //         document.getElementById("form-container").submit();
    //     else
    //         alert("Form is invalid");
    // }
  }

  SInButtonOptions = {
    text: "Sign In",
    // onClick: function() {
    //     const validationResult = formInstance.validate(); // get Form instance beforehand
    //     if (validationResult.isValid)
    //         document.getElementById("form-container").submit();
    //     else
    //         alert("Form is invalid");
    // }
  }
}
