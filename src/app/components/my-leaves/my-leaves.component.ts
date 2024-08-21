import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { AbsenceService } from '../../services/absence.service';
import { AuthService } from '../../services/auth.service';
import notify from 'devextreme/ui/notify';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-my-leaves',
  templateUrl: './my-leaves.component.html',
  styleUrl: './my-leaves.component.css',
})
export class MyLeavesComponent implements OnInit {
  storedTheme = localStorage.getItem('theme');

  isLoading: boolean = true;
  minStartDate: Date = new Date();
  startDate: Date=new Date();
  endDate: Date=this.addDays(new Date(), 1);
  absences: any[] = [];  
  currentUser: any[] = []
  substitutesMap: Map<string, string> = new Map();

  processStatesOptions: {Value: string, Description: string}[] = [];
  leaveTypeOptions: {Value: string, Description: string}[] = [];
  isApprovedOptions: {Value: string, Description: string}[] = [];

  substitutes: any[] = [];

  dayTypeOptions = [
    { id: 'am', name: 'Half Day (AM)' },
    { id: 'pm', name: 'Half Day (PM)' },
    { id: 'full', name: 'Full Day' }
  ];

  disabledDates: Date[] = [];
  disabledDatesClone: Date[]=[];
  oldDisabledDates: Date[]=[];

  popupAddVisible: boolean = false
  popupEditVisible: boolean = false


  customEditPopupOptions: any = {
    title: "Edit Absence",
    showTitle: true,
    dragEnabled: true,
    hideOnOutsideClick: true,
    position: {
      my: "center",
      at: "center",
      of: window
    },
  };

  newLeave = {
    Mode: 0,
    Person:'',
    StartDate: new Date(),
    EndDate: this.addDays(new Date(), 1),
    DayType: '',
    Type: '',
    Duration: 1,
    Status: '',
    RequestDate: new Date(),  
    Substitute: '',
    IsApproved: '',
    ObjectType: '',
    Id: ''
  };

  currentLeave = {
    Mode: 1,
    Person:'',
    StartDate: new Date(),
    EndDate: this.addDays(new Date(), 1),
    DayType: '',
    Type: '',
    Duration: 1,
    Status: '',
    RequestDate: new Date(),
    Substitute: '',
    IsApproved: '',
    ObjectType: '',
    Id: ''
  };

  editingRowData: any = {};


  constructor(private personService: PersonService, private absenceService: AbsenceService, private authService: AuthService){}

  onEditingStart(e: any) {    
    this.editingRowData = { ...e.data };
    const index = this.absences.findIndex(absence => absence.Id === this.editingRowData.Id);
    if (index > -1) {
      const absence = { ...this.editingRowData };
      setTimeout(() => {
        this.currentLeave.Duration = Math.abs(absence.Days);
        this.currentLeave.RequestDate = absence.ApplicantDate;
      }, 0);
      this.currentLeave.Person = absence.ParentId
      this.currentLeave.Id = absence.Id;
      this.currentLeave.StartDate = absence.StartDate;
      this.currentLeave.EndDate = absence.EndDate;
      if(absence.Days == 1){
        this.currentLeave.DayType = this.dayTypeOptions[2].id;
      } else if(absence.Days == 0.5) {
        this.currentLeave.DayType = this.dayTypeOptions[1].id;
      } else if(absence.Days == -0.5) {
        this.currentLeave.DayType = this.dayTypeOptions[0].id;
      } else {
        this.currentLeave.DayType = ''
      }
      this.currentLeave.Type = this.leaveTypeOptions[absence.Type].Value
      this.currentLeave.Substitute = absence.IdRefPersonSubstitution
      this.currentLeave.Status = this.processStatesOptions[absence.ProcessState].Value
      this.currentLeave.IsApproved = this.isApprovedOptions[absence.IsApproved].Value
      // console.log({ ...this.editingRowData });

      let start = new Date(absence.StartDate)
      const end = new Date(absence.EndDate)
      while(start <= end)  {
        const index = this.disabledDates.findIndex(date => this.compareDates(date, start));
        this.disabledDates.splice(index, 1);
        this.oldDisabledDates.push(start);
        start = this.addDays(start, 1)
      }

      // console.log('9bal l edit:', this.disabledDates)

    }
    this.popupEditVisible = true;
    e.cancel = true; // Cancel the default editing
  }


  onRowPrepared(e: any) {
    if (e.rowType === 'data' && !this.isRowEditable(e.data)) {
      e.rowElement.classList.add('no-edit-icon');
    }
  }

  isRowEditable(rowData: any): boolean {
    return new Date(rowData.StartDate) > new Date();
  }










  ngOnInit() {
    this.loadData()
  }

  onRowRemoving(e: any) {
    const rowData = e.data;
    this.delete(rowData.Id)      
  }


  getPersons() {
    this.personService.getPersonTest().subscribe(
      data => {
        this.substitutes = data
          .filter((person: { Id: string, FirstName: string, LastName: string, Position: string }) => person.Id !== this.currentUser[0].Id)
          .map((person: { Id: string, FirstName: string, LastName: string, Position: string }) => ({
            ...person,
            FullName: `${person.FirstName} ${person.LastName}`
          }));
          this.substitutes.forEach(person => {
          this.substitutesMap.set(person.Id, person.FullName);
        });
          // console.log('persons:', this.substitutes);
      },
      error => {
        console.error('Error fetching persons:', error);
      }
    );
  }

  async getCurrentUser() {
    try {
      const data = await lastValueFrom(this.personService.getCurrentUserTest());
      this.currentUser = data.map((person: { Id: string, FirstName: string, LastName: string, Position: string }) => ({
        ...person,
        FullName: `${person.FirstName} ${person.LastName}`
      }));
      // console.log('current user:', data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  
  async getAbsences() {
    try {
      this.absences = [];
      const data = await this.absenceService.getAbsenceTest().toPromise();
      this.absences = data.filter((absence: any) => absence.ParentId === this.currentUser[0].Id);
    } catch (error) {
      console.error('Error fetching absences:', error);
    }
  }

  async getPickAbsenceType() {
    try {
      const data = await this.absenceService.getPickTest('Type').toPromise();
      this.leaveTypeOptions = data.Data;
      // console.log("types :", this.leaveTypeOptions);
    } catch (error) {
      console.error('Error fetching pick types:', error);
    }
  }

  getPickAbsenceParent() {
    this.absenceService.getPickTest('ParentId').subscribe(data=> {
      // console.log("ParentId:",data)
    }, error => {
        console.error('Error fetching pick types:', error);
      });  
  }

  getPickProcessStateType() {
    this.absenceService.getPickTest('ProcessState').subscribe(data=> {
      this.processStatesOptions = data.Data
      // console.log("process states:",this.processStatesOptions)
    }, error => {
        console.error('Error fetching pick process states:', error);
      });  
  }

  async getPickIsApprovedType() {
    try {
      const data = await this.absenceService.getPickTest('IsApproved').toPromise();
      this.isApprovedOptions = data.Data;
      // console.log("isApproved states:", this.isApprovedOptions);
    } catch (error) {
      console.error('Error fetching pick isApproved states:', error);
    }
  }

  prepareDisabledDates() {
    this.disabledDates = [];
    this.absences.forEach(absence => {
      const startDate = new Date(absence.StartDate);
      const endDate = new Date(absence.EndDate);
      if(this.compareDates(startDate, endDate)) {
        this.disabledDates.push(new Date(startDate));
      } else {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          this.disabledDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
  
    this.disabledDatesClone = this.disabledDates.slice();
  }

  async loadData() {
    try {
      await this.getCurrentUser()
      this.getPersons()  
      await this.getAbsences()
      await this.getPickAbsenceType()
      this.getPickProcessStateType()
      await this.getPickIsApprovedType()
      this.calculateDuration()
      this.prepareDisabledDates()
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false
    }
  }  
  
  resetFields() {
    this.newLeave = {
      Mode: 0,
      Person:'',
      StartDate: new Date(),
      EndDate: this.addDays(new Date(), 1),
      DayType: '',
      Type: '',
      Duration: 1,
      Status: '',
      RequestDate: new Date(),
      Substitute: '',
      IsApproved: '',
      ObjectType: '',
      Id: ''
    };
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  onStartDateChanged(e: any): void {
    this.newLeave.StartDate = e.value;
    this.calculateDuration();
  }
  
  onEndDateChanged(e: any): void {
    this.newLeave.EndDate = e.value;
    this.calculateDuration();
  }

  calculateDuration() {
    this.startDate = this.newLeave.StartDate;
    this.endDate = this.newLeave.EndDate;

    if(this.startDate > this.endDate) {
      if(this.isDateDisabled(this.addDays(this.startDate, 1))) {
        this.newLeave.EndDate = this.startDate;
      } else {
        this.newLeave.EndDate = this.addDays(this.startDate, 1);
      }
    }    
    this.newLeave.Duration = Math.ceil((this.newLeave.EndDate.getTime() - this.newLeave.StartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  onStartDateChangedEdit(e: any): void {
    this.currentLeave.StartDate = e.value;
    this.calculateDurationEdit();
  }
  
  onEndDateChangedEdit(e: any): void {
    this.currentLeave.EndDate = e.value;
    this.calculateDurationEdit();
  }
  
  calculateDurationEdit(): void {
    this.startDate = new Date(this.currentLeave.StartDate);
    this.endDate = new Date(this.currentLeave.EndDate);
    
    if (this.startDate > this.endDate) {
      if (this.isDateDisabled(this.addDays(this.startDate, 1))) {
        this.currentLeave.EndDate = this.startDate;
      } else {
        this.currentLeave.EndDate = this.addDays(this.startDate, 1);
      }
    }
  
    this.currentLeave.Duration = Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  calculateDatesInit() {
    let date = new Date(this.minStartDate);
    while (this.isDateDisabled(date)) {
      date.setDate(date.getDate() + 1);
    }
    this.newLeave.StartDate = date;
    this.newLeave.EndDate = date;

    date = this.addDays(this.newLeave.StartDate, 1)
    if(!this.isDateDisabled(date)) {
      this.newLeave.EndDate = this.addDays(this.newLeave.StartDate, 1);
    }
  }
  
  isDateDisabled(date: Date): boolean {
    const val = this.disabledDates.some(disabledDate => 
      new Date(disabledDate).getFullYear() === new Date (date).getFullYear() &&
      new Date(disabledDate).getMonth() === new Date (date).getMonth() &&
      new Date(disabledDate).getDate() === new Date (date).getDate()
    );
    return val;
  }

  compareDates(date1: Date, date2: Date): boolean {
    return new Date(date1).getDate() === new Date (date2).getDate() &&
           new Date (date1).getMonth() === new Date (date2).getMonth() &&
           new Date (date1).getFullYear() === new Date (date2).getFullYear();
  }

  isSameDayAdd(): boolean {
    if(this.newLeave.StartDate && this.newLeave.EndDate && this.compareDates(this.newLeave.StartDate, this.newLeave.EndDate)) {
      return true
    } else {
      this.newLeave.DayType = ''
      return false
    }
  }
  isSameDayEdit(): boolean {
    if(this.currentLeave.StartDate && this.currentLeave.EndDate && this.compareDates(this.currentLeave.StartDate, this.currentLeave.EndDate)) {
      return true
    } else {
      this.currentLeave.DayType = ''
      return false
    }
  }

  updateDurationBasedOnDayType(): void {
    if (this.newLeave.DayType === 'full') {
      this.newLeave.Duration = 1;
    } else if (this.newLeave.DayType === 'am' || this.newLeave.DayType === 'pm') {
      this.newLeave.Duration = 0.5;
    } 
  }

  updateDurationBasedOnDayTypeEdit(): void {
    if (this.currentLeave.DayType === 'full') {
      this.currentLeave.Duration = 1;
    } else if (this.currentLeave.DayType === 'am' || this.currentLeave.DayType === 'pm') {
      this.currentLeave.Duration = 0.5;
    } 
  }

  getSubstituteName(id: string): string {
    return this.substitutesMap.get(id) || '';
  }

  substituteCellTemplate = (cellElement: any, cellInfo: any) => {
    const substituteName = this.getSubstituteName(cellInfo.data.IdRefPersonSubstitution);
    cellElement.textContent = substituteName;
  }

  add(): void {
    // Validate form before submission
    const isValid = this.validateForm();
    const isValidPeriod = this.validatePeriod(this.newLeave.StartDate, this.newLeave.EndDate);

    if (isValid) {
      if(isValidPeriod){
            //********************** persist method ************************
          this.addAbsence()
          this.closeAddLeavePopup()
      } else {
          notify(this.notify('Please enter a valid period !'), 'error');
      }
    } else {
      notify(this.notify('Please fill in all the fields !'), 'error');
    }
}

  edit() {
    // Validate form before submission
    const isValid = this.validateFormEdit();
    const isValidPeriod = this.validatePeriod(this.currentLeave.StartDate, this.currentLeave.EndDate);

    if (isValid) {
      if(isValidPeriod){
            //********************** persist method ************************
          this.editAbsence()
          this.popupEditVisible = false;
      } else {
          notify(this.notify('Please enter a valid period !'), 'error');
      }
    } else {
      notify(this.notify('Please fill in all the fields !'), 'error');
    }
  }
  removeAbsenceById(id: string) {
    this.absences = this.absences.filter(absence => absence.Id !== id);
  }

  delete(id: string) {
    this.deleteAbsence(id)
  }

  deleteAbsence(id: string) {
    // console.log('9bal l delete:', this.disabledDates)

    this.currentLeave.Mode = 3
    this.currentLeave.Id = id

    this.absenceService.insertAbsenceTest(this.currentLeave).subscribe(data=> {
      this.removeAbsenceById(this.currentLeave.Id);
      this.prepareDisabledDates();

      // console.log('ba3ad l delete:', this.disabledDates)


    notify(this.notify('Absence deleted successfully !'), 'success');
      }, error => {
        notify(this.notify('Error deleting Absence !'), 'error');
        console.error('Error deleting Absence:', error);
    });
  }

  validateForm(): boolean {  
    if(this.newLeave.Person && this.newLeave.StartDate && this.newLeave.EndDate 
      && this.newLeave.Type && this.newLeave.Substitute 
      && ( (this.isSameDayAdd() && this.newLeave.DayType) || (!this.isSameDayAdd()) )) {
      return true
    }
    return false 
  }

  validateFormEdit(): boolean {  
    if(this.currentLeave.Person && this.currentLeave.StartDate && this.currentLeave.EndDate 
      && this.currentLeave.Type && this.currentLeave.Substitute 
      && ( (this.isSameDayEdit() && this.currentLeave.DayType) || (!this.isSameDayEdit()) )) {
      return true
    }
    return false 
  }

  validatePeriod(start: Date, end: Date) {
    while(!this.isDateDisabled(start) && !this.compareDates(start, end)){
      start = this.addDays(start, 1)
    }
    if(this.compareDates(start, end)){
      return true;
    }
    return false;
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

  addAbsence() {
          // console.log('9bal l add:', this.disabledDates)

    this.newLeave.Status = this.processStatesOptions[0].Value
    this.newLeave.IsApproved = this.isApprovedOptions[0].Value
    if(this.newLeave.DayType === 'am') {
      this.newLeave.Duration = -0.5
    }

    this.absenceService.insertAbsenceTest(this.newLeave).subscribe( async data=> {
      // this.persons.push(this.newPerson)
      await this.getAbsences()
      this.prepareDisabledDates();

      // console.log('ba3ad l add:', this.disabledDates)


      notify(this.notify('Absence added successfully !'), 'success');
    }, error => {
        notify(this.notify('Error adding Absence !'), 'error');
        console.error('Error adding Absence:', error);
      });
  }

  editAbsence() {
    // console.log('9bal l edit:', this.disabledDates)
    if(this.currentLeave.DayType === 'am') {
      this.currentLeave.Duration = -0.5
    }

    // console.log(this.currentLeave)
    this.absenceService.insertAbsenceTest(this.currentLeave).subscribe(async data=> {

      // let index = this.absences.findIndex(absence => absence.Id === this.currentLeave.Id); 
      // this.absences.splice(index, 1, this.currentLeave);
      await this.getAbsences()

      this.prepareDisabledDates();


      // console.log('ba3ad l edit:', this.disabledDates)

      notify(this.notify('Absence edited successfully !'), 'success');
    }, error => {
        notify(this.notify('Error editting Absence !'), 'error');
        console.error('Error editting Absence:', error);
      });
  }

  openAddLeavePopup() {
    this.newLeave.Person = this.currentUser[0].Id
    this.calculateDatesInit()
    this.popupAddVisible = true;
  }
  
  closeAddLeavePopup() {
    this.popupAddVisible = false;
    this.resetFields()
  }

  openEditLeavePopup() {
    this.popupEditVisible = true;
  }
  
  closeEditLeavePopup() {
    this.disabledDates = this.disabledDatesClone.slice();
    this.popupEditVisible = false;
  }

  getDurationDisplayValue(rowData: any){
    return Math.abs(rowData.Days)
  }


  onCellPrepared(e: any) {
    if (e.rowType === 'data' && e.column.dataField === 'IsApproved') {
      const status = e.data.IsApproved
      e.cellElement.style.textTransform = "capitalize";
      if (status == 1) {
        e.cellElement.style.backgroundColor = '#90EE90';  //95D2B3
      } else if (status == 2) {
        e.cellElement.style.backgroundColor = '#FF7F7F'; //FFAAAA
      }
      else if (status == 0) {
        e.cellElement.style.backgroundColor = '#FFFDAF'; //FEEFAD 
      }
    }
  } 
}
