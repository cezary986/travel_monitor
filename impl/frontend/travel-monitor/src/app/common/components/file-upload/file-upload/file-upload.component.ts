import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { fileToBase64 } from '../utils';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  public static readonly ACCEPTS_IMAGES = 'image/jpeg, image/png, image/jpg, image/bmp'

  @Input() drop = true;
  @Input() accepts = '*'
  @Input() multiple = true;
  @Input() maxSize: number = null; // in bytes (null means no limit)
  @Input() _required = false;
  @Input() set required(value: boolean) {
    if (value && this.formControl.validator !== Validators.required) {
      this.formControl.setValidators(Validators.required);
    } else if (!value) {
      this.formControl.setValidators([]);
    }
    this.formControl.updateValueAndValidity();
  }

  @Output() files: EventEmitter<File[]> = new EventEmitter();
  @Output() base64: EventEmitter<string[]> = new EventEmitter();
  @Output() fileChangeEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('dropContainer', null) dropContainer;
  @ViewChild('fileInput', null) fileInput;

  public dragEnter: boolean = false;
  private filesArray: File[] = [];

  private formControl: FormControl = new FormControl('', Validators.required);

  constructor() {
    this.formControl = new FormControl(null);
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.drop) {
        this.setupDropContainer();
      }
    }, 0);

  }

  private setupDropContainer() {
    const dropContainer = this.dropContainer.nativeElement;
    const fileInput = this.fileInput.nativeElement;

    dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
      this.dragEnter = true;
      evt.preventDefault();
    }.bind(this);

    dropContainer.ondrop = function (evt) {
      evt.preventDefault();
      fileInput.files = evt.dataTransfer.files;
      this.onSelectedFilesChange();
      this.fileInput.nativeElement.dispatchEvent(new Event('change'));
      this.filesArray = fileInput.files;
      this.dragEnter = false;
    }.bind(this);

    dropContainer.ondragleave = function (evt) {
      this.dragEnter = false;
    }.bind(this);
  }

  public onChooseFileButtonClick() {
    this.fileInput.nativeElement.click();
  }

  public onFileChosen(event) {
    const files = event.target.files;
    this.onSelectedFilesChange();
    this.filesArray = files;

    if (this.files.observers.length > 0) {
      this.files.emit(this.multiple ? files : [files[0]]);
    }
    if (this.fileChangeEvent.observers.length > 0) {
      this.fileChangeEvent.emit(event);
    }
    if (this.base64.observers.length > 0) {
      const observervables = [];
      for (let i = 0; i < files.length; i++) {
        observervables.push(fileToBase64(files[i]));
      }
      forkJoin(observervables).subscribe((base64Data: string[]) => {
        if (base64Data != undefined) {
          this.base64.emit(this.multiple ? base64Data : [base64Data[0]]);
        }
      });
    }
  }

  private onSelectedFilesChange() {
    this.formControl.setValue(this.fileInput.nativeElement.value);
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity();
  }

  public onFileDeleteClick(index: number) {
    this.filesArray = Array.from(this.filesArray)
    this.filesArray.splice(index, 1);
  }


  public getAsFormControl() {
    return this.formControl;
  }
}
