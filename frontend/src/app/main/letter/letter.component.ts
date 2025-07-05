import { Component } from '@angular/core';
import { LetterService } from 'src/services/letter.service';
import { Letter } from 'src/models/letter.model';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css'],
  standalone: false,
})
export class LetterComponent {
  constructor(private letterService: LetterService) {}
  loader = true;
  letter: string = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 1300);
  }

  sendLetter() {
    if (!this.letter || this.letter.trim() === '') {
      alert('Cannot send empty letters');
      return;
    }

    const letterRequest: Letter = {
      message: this.letter,
    };

    this.letterService.send(letterRequest).subscribe({
      next: (res) => {
        console.log(res);
        alert('Letter sent successfully');
      },
      error: (err) => {
        console.log(err);
        alert('Cannot send letter. Please refresh the page.');
      },
      complete: () => {
        this.letter = '';
      },
    });
  }
}
