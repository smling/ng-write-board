import { Component, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { GoogleInputToolService } from '../services/google-input-tool.service';
import { Language, LanguageToLabelMapping } from './language';
import { WriteBoardOption } from './write-board-option';

@Component({
  selector: 'lib-writeboard',
  templateUrl: './writeboard.component.html',
  styleUrls: ['./writeboard.component.css']
})
export class WriteboardComponent implements AfterContentInit {

  writeBoardCanvas: HTMLElement | null | undefined;

  writeBoardContext: CanvasRenderingContext2D | null | undefined;

  @Input()
  width: number | undefined = 400;

  @Input()
  height: number | undefined = 400;

  @Output()
  textSelected = new EventEmitter();

  languages : string[] = Object.values(Language);
  public languageToLabelMapping : Record<Language, string> = LanguageToLabelMapping;

  drawing: boolean = false;
  handwritingX : number[] = [];
  handwritingY : number[] = [];
  trace: any;
  step: any;
  redoTrace: any;
  redoStep: any;

  recognizeText : string[] = [];

  constructor(
    private googleInputToolService: GoogleInputToolService
    ) { }

  @Input()
  writeBoardOption! : WriteBoardOption;

  ngAfterContentInit(): void {
    if(!this.writeBoardOption)
      this.writeBoardOption = new WriteBoardOption();

    this.writeBoardCanvas = document.getElementById("canvas-write-board");
    const writeboard = this.writeBoardCanvas as HTMLCanvasElement;
    this.writeBoardContext = writeboard.getContext('2d');
    this.writeBoardContext!.lineCap = "round";
    this.writeBoardContext!.lineJoin = "round";
    this.writeBoardContext!.lineWidth = this.writeBoardOption.lineWidth;
    this.reset();
  }

  reset() : void {
    this.writeBoardContext?.clearRect(0, 0, this.width!, this.height!);
    this.trace = [];
    this.step = [];
    this.redoTrace = [];
    this.redoStep = [];
    this.recognizeText= [];
    for(let i=0; i< this.writeBoardOption.numberOfWords; i++) {
      this.recognizeText.push(" ");
    }
  }

  writeboardMouseDown(event: MouseEvent) : void {
    event.preventDefault();
    this.handwritingX = [];
    this.handwritingY = [];
    this.drawing = true;
    this.writeBoardContext?.beginPath();
    const rect = this.writeBoardCanvas!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.writeBoardContext?.moveTo(x, y);
    this.handwritingX.push(x);
    this.handwritingY.push(y);
  }

  writeboardMouseMove(event: MouseEvent) : void {
    event.preventDefault();
    if (this.drawing) {
      const rect = this.writeBoardCanvas!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.writeBoardContext?.lineTo(x, y);
      this.writeBoardContext?.stroke();
      this.handwritingX.push(x);
      this.handwritingY.push(y);
    }
  }

  writeboardMouseUp(event: MouseEvent) : void {
    event.preventDefault();
    let w = [];
    w.push(this.handwritingX);
    w.push(this.handwritingY);
    w.push([]);
    this.trace.push(w);
    this.drawing = false;
    if(this.writeBoardOption.allowUndo) {
      const writeboard = this.writeBoardCanvas as HTMLCanvasElement;
      this.step.push(writeboard.toDataURL());
    }
  }

  writeboardTouchStart(event: TouchEvent) : void {
    event.preventDefault();
    this.writeBoardContext!.lineWidth = this.writeBoardOption.lineWidth;
    this.handwritingX = [];
    this.handwritingY = [];
    const box = this.writeBoardCanvas?.getBoundingClientRect();
    const top = box!.top + window.scrollY - document.documentElement.clientTop;
    const left = box!.left + window.scrollX - document.documentElement.clientLeft;
    const touch = event.changedTouches[0];
    const touchX = touch.pageX - left;
    const touchY = touch.pageY - top;
    this.handwritingX.push(touchX);
    this.handwritingY.push(touchY);
    this.writeBoardContext!.beginPath();
    this.writeBoardContext!.moveTo(touchX, touchY);
  }

  writeboardTouchMove(event: TouchEvent) : void {
    event.preventDefault();
    const touch = event.targetTouches[0];
    const box = this.writeBoardCanvas!.getBoundingClientRect();
    const top = box.top + window.scrollY - document.documentElement.clientTop;
    const left = box.left + window.scrollX - document.documentElement.clientLeft;
    const x = touch.pageX - left;
    const y = touch.pageY - top;
    this.handwritingX.push(x);
    this.handwritingY.push(y);
    this.writeBoardContext!.lineTo(x, y);
    this.writeBoardContext!.stroke();
  }

  writeboardTouchEnd(event: TouchEvent) : void {
    event.preventDefault();
    var w = [];
    w.push(this.handwritingX);
    w.push(this.handwritingY);
    w.push([]);
    this.trace.push(w);
    if(this.writeBoardOption.allowUndo) {
      const writeboard = this.writeBoardCanvas as HTMLCanvasElement;
      this.step.push(writeboard.toDataURL());
    }
  }

  undo() {
    const allowUndo = this.writeBoardOption.allowUndo;
    const allowRedo = this.writeBoardOption.allowRedo;
    if (!allowUndo || this.step.length <= 0) return;
        else if (this.step.length === 1) {
            if (allowRedo) {
                this.redoStep.push(this.step.pop());
                this.redoTrace.push(this.trace.pop());
                this.writeBoardContext!.clearRect(0, 0, this.width!, this.height!);
            }
        } else {
            if (allowRedo) {
                this.redoStep.push(this.step.pop());
                this.redoTrace.push(this.trace.pop());
            } else {
                this.step.pop();
                this.trace.pop();
            }
            this.loadFromUrl(this.step.slice(-1)[0], this.writeBoardContext!, this.width!, this.height!);
        }
  }

  redo() {
    const allowUndo = this.writeBoardOption.allowUndo;
    if (!allowUndo || this.step.length <= 0) return;
        this.step.push(this.redoStep.pop());
        this.trace.push(this.redoTrace.pop());
        this.loadFromUrl(this.step.slice(-1)[0],  this.writeBoardContext!, this.width!, this.height!);
  }

  loadFromUrl(url: string, cvs: CanvasRenderingContext2D, width: number, height: number) {
    var imageObj = new Image();
    imageObj.onload = function() {
        cvs.clearRect(0, 0, width, height);
        cvs.drawImage(imageObj, 0, 0);
    };
    imageObj.src = url;
  }

  recognize() {
    this.googleInputToolService.recognize(this.trace, this.writeBoardOption.language).subscribe((response: { type: number; status: any; body: any; }) => {
      if(response.type === 4) {
        switch (response.status) {
           case 200:
              const content : any = response.body;
              if(content[0] !== "SUCCESS") {
                throw new Error("Cannot resolve response.");
              }
              const recognizedText : string[] = content[1][0][1];
              this.recognizeText = recognizedText;
             break;
             case 403:
               throw new Error("Access denied.");
              case 502:
                throw new Error("Cannot connect to server.");
        }
      }
    })
  }

  recognizedTextSelected(event: Event) {
    const htmlElement : HTMLElement = event.target as HTMLElement;
    const value = htmlElement.innerText;
    this.textSelected.emit(value);
    this.reset();
  }
}
