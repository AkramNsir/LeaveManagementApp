import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { AbsenceService } from '../../services/absence.service';
import { AuthService } from '../../services/auth.service';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css'
})
export class PersonsComponent {
  persons: any[]= []
  positions: any[]=[]
  holidays: any[] = []
  message: string = ''
  filteredPersons: any[] = []
  searchValue: string = ''
  popupAddVisible: boolean = false
  popupEditVisible: boolean = false
  popupDeleteVisible: boolean = false
  isAdmin: boolean = this.authService.getUsername()==='E.Ghadhab'  // admin-username-here

  newPerson = {
    Mode: 0,
    FirstName: '',
    LastName: '',
    Position: '',
    ObjectType:'',
    Id: ''
  };

  currentPerson = {
    Mode: 1,
    FirstName: '',
    LastName: '',
    Position: '',
    ObjectType:'',
    Id: ''
  }

  
  constructor(private personService: PersonService, private authService: AuthService, 
              private absenceService: AbsenceService){}

  ngOnInit() {
    this.getPersons()
    this.getPickPersonPosition()
  }

  filterPersons() {
    if (!this.searchValue) {
      this.filteredPersons = this.persons.slice(); 
    } else {
      this.filteredPersons = this.persons.filter(person =>
        person.FirstName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        person.LastName.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  }

  resetFields() {
    this.newPerson = {
      Mode: 0,
      FirstName: '',
      LastName: '',
      Position: '',
      ObjectType:'',
      Id: ''
    };
  }


  openAddPersonPopup() {
    this.popupAddVisible = true;
  }
  
  closeAddPersonPopup() {
    this.popupAddVisible = false;
    this.resetFields()
  }

  openEditPersonPopup(person?: any) {
    this.popupEditVisible = true;
    this.currentPerson.Id = person.Id
    this.currentPerson.FirstName= person.FirstName
    this.currentPerson.LastName= person.LastName
    this.currentPerson.Position= person.Position
  }
  
  closeEditPersonPopup() {
    this.popupEditVisible = false;
  }

  openDeletePersonPopup(person?: any) {
    this.popupDeleteVisible = true;
    this.currentPerson.Id = person.Id
  }
  
  closeDeletePersonPopup() {
    this.popupDeleteVisible = false;
  }

  add(): void {
    // Validate form before submission
    const isValid = this.validateAddForm();

    if (isValid) {
      //********************** persist method ************************
      this.addPerson() 

    } else {
      notify(this.notify('Please fill in all the fields !'), 'error');
    }
  }

  edit(): void {
    // Validate form before submission
    const isValid = this.validateEditForm();

    if (isValid) {
      //********************** patch method ************************
      this.editPerson()

    } else {
      notify(this.notify('Please fill in all the fields !'), 'error');
    }
  }

  delete(): void {
  
      //********************** delete method ************************
      this.deletePerson()
  }

  validateAddForm(): boolean {  
    if(this.newPerson.FirstName && this.newPerson.LastName && this.newPerson.Position) {
      return true
    }
    return false 
  }

  validateEditForm(): boolean {  
    if(this.currentPerson.FirstName && this.currentPerson.LastName && this.currentPerson.Position) {
      return true
    }
    return false 
  }

  notify(msg: string){
    const notif = {
      message: msg,
      width: 300,
      position: {
        my: 'center top',
        at: 'center top'
      }, 
      displayTime: 3000
    }
    return notif
  }

  removePersonById(id: string) {
    this.persons = this.persons.filter(person => person.Id !== id);
  }

  addPerson(){
    this.personService.insertPersonTest(this.newPerson).subscribe(data=> {
      // this.persons.push(this.newPerson)
      this.getPersons()

      notify(this.notify('Person added successfully !'), 'success');
      this.searchValue = ''
      this.closeAddPersonPopup()
    }, error => {
        notify(this.notify('Error adding person !'), 'error');
        console.error('Error adding person:', error);
      });
  }

  editPerson(){
    this.personService.insertPersonTest(this.currentPerson).subscribe(data=> { 
        let index = this.persons.findIndex(person => person.Id === this.currentPerson.Id); 
        this.persons.splice(index, 1, this.currentPerson);
        this.filterPersons()

        notify(this.notify('Person edited successfully !'), 'success');
        this.searchValue = ''
        this.closeEditPersonPopup()
      }, error => {
        notify(this.notify('Error editing person !'), 'error');
        console.error('Error editing person:', error);
      });
  }

  deletePerson() {
    this.currentPerson.Mode = 3
    
    this.personService.insertPersonTest(this.currentPerson).subscribe(data=> {
      this.removePersonById(this.currentPerson.Id)
      this.filterPersons()

      notify(this.notify('Person deleted successfully !'), 'success');
      this.searchValue = ''
      this.closeDeletePersonPopup()
      }, error => {
        notify(this.notify('Error deleting person !'), 'error');
        console.error('Error deleting person:', error);
      });
  }

  getPersons() {
    this.message = 'Fetching data ...'
    this.personService.getPersonTest().subscribe(data=> {
      this.message = ''
      this.persons = data
      this.filteredPersons = this.persons.slice()
    }, error => {
        this.message = ''
        console.error('Error fetching persons:', error);
      });
  }

  getPickPersonPosition() {
    this.personService.getPickTest().subscribe(data=> {
      this.positions = data.Data
    }, error => {
        console.error('Error fetching pick:', error);
      });  
  }
}
