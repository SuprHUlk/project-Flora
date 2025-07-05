import { Component } from '@angular/core';
import { Letter } from 'src/models/letter.model';
import { LetterService } from 'src/services/letter.service';

interface message {
  message: string;
  where: string;
}

@Component({
  selector: 'app-my-letters',
  templateUrl: './my-letters.component.html',
  styleUrls: ['./my-letters.component.css'],
  standalone: false,
})
export class MyLettersComponent {
  constructor(private letterService: LetterService) {}
  loader: boolean = true;

  letters: Letter[] = [];

  ngOnInit() {
    this.getLetters();
    this.load();
  }

  load() {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 1);
  }

  getLetters() {
    this.letterService.get().subscribe({
      next: (letters: Letter[]) => {
        this.letters = letters;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
