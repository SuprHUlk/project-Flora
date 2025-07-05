import { Component } from '@angular/core';
import { LetterService } from 'src/services/letter.service';
import { Letter } from 'src/models/letter.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent {
  constructor(private letterService: LetterService) {}

  display = false;
  letterMessage: string = '';
  loader = true;

  openedLetter: Letter | null;

  letters: Letter[] = [];

  ngOnInit() {
    this.load(); //calling loader in home page
    this.getReceivedLetters();
  }

  load() {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 5500);
  }

  getReceivedLetters() {
    this.letterService.received().subscribe({
      next: (res: Letter[]) => {
        console.log(res);
        this.letters = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sendletter() {
    this.letterService.reject(this.openedLetter!).subscribe({
      next: (res) => {
        console.log(res);
        alert('Letter reject: Nice job!!!');
      },
      error: (err) => {
        alert('Cannot reject the letter: Please try again later');
        console.log(err);
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
        alert(res);
      },
      error: (err) => {
        console.log(err);
        alert('Cannot accpet the letter: Please try again later');
      },
      complete: () => {
        this.updateLettersList();
        this.closeLetter();
      },
    });
  }
}
