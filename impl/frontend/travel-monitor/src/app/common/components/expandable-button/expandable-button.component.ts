import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AnimationsFactory } from '../../animations';

@Component({
  selector: 'app-expandable-button',
  templateUrl: './expandable-button.component.html',
  styleUrls: ['./expandable-button.component.scss'],
  animations: [
    AnimationsFactory.makeEnterLeaveAnimation(
      'buttonAnimation',
      AnimationsFactory.animations.enter.fadeIn,
      AnimationsFactory.animations.leave.fadeOut
    ),
  ]
})
export class ExpandableButtonComponent implements OnInit {

  @ViewChild('container', null) containerElement;
  @Input() text: string;
  @Input() disabled?: boolean = false;
  private _collapsed: boolean = true;
  @Input() set collapsed(value: boolean) {
    this._collapsed = value;
    if (!this._collapsed) {
      setTimeout(function () {
        this.expand();
      }.bind(this), 50)
    } else {
      this.collapse()
    }
  }
  @Output() onClick: EventEmitter<Event> = new EventEmitter<Event>();
  constructor() { }

  ngOnInit() {
  }

  private expand() {
    console.log('sfsdf');

    const domElement = this.containerElement.nativeElement;
    const elementHeight = domElement.offsetHeight;
    domElement.style.maxHeight = elementHeight + 16 + 'px';
    domElement.style.minHeight = elementHeight + 16 + 'px';
  }

  private collapse() {
    this.containerElement.nativeElement.style.maxHeight = '0';
    this.containerElement.nativeElement.style.minHeight = '0';
  }

  public onButtonClick() {
    console.log('dasdas');
    this._collapsed = false;
    setTimeout(function () {
      this.expand();
    }.bind(this), 50)

  }
}
