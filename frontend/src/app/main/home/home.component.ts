import { Component } from '@angular/core';
import { LetterService } from 'src/services/letter.service';
import { Letter } from 'src/models/letter.model';
import { ToastService } from 'src/services/shared/toast.service';
import { Toast } from 'src/models/toast.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent {
  constructor(
    private letterService: LetterService,
    private toastService: ToastService
  ) {}

  display: boolean = false;
  letterMessage: string = '';
  loader: boolean = true;

  openedLetter: Letter | null;

  letters: Letter[] = [];

  ngOnInit() {
    this.getReceivedLetters();
  }

  getReceivedLetters() {
    this.letterService.getLetter$().subscribe({
      next: (res: Letter[]) => {
        console.log(res);
        this.letters = res;
        this.loader = false;
      },
      error: (err) => {
        console.log(err);
        this.toastService.error({
          message: 'Error: Please refresh the page',
          autohide: true,
        });
      },
      complete: () => {
        this.loader = false;
      },
    });
  }

  sendletter() {
    this.letterService.reject(this.openedLetter!).subscribe({
      next: (res) => {
        console.log(res);
        this.toastService.show({
          message: 'Letter rejected: Nice job!!!',
          autohide: true,
        });
      },
      error: (err) => {
        console.error(err);
        this.toastService.error({
          message: 'Cannot reject the letter: Please try again later',
          autohide: true,
        });
      },
      complete: () => {
        this.updateLettersList();
        this.closeLetter();
      },
    });
  }

  showLetter(idx: number) {
    this.openedLetter = this.letters[idx];
    this.display = true;
  }

  updateLettersList() {
    this.letters = this.letters.filter(
      (letter) => letter._id != this.openedLetter?._id
    );
  }

  closeLetter() {
    this.openedLetter = null;
    this.display = false;
  }

  onAccept() {
    this.letterService.accept(this.openedLetter!).subscribe({
      next: (res: string) => {
        this.toastService.show({
          message: res,
          autohide: true,
        });
      },
      error: (err) => {
        console.log(err);
        this.toastService.error({
          message: 'Cannot accpet the letter: Please try again later',
          autohide: true,
        });
      },
      complete: () => {
        this.updateLettersList();
        this.closeLetter();
      },
    });
  }
}
