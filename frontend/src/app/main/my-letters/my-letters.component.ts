import { Component } from '@angular/core';
import { Letter } from 'src/models/letter.model';
import { LetterService } from 'src/services/letter.service';
import { ToastService } from 'src/services/shared/toast.service';

@Component({
  selector: 'app-my-letters',
  templateUrl: './my-letters.component.html',
  styleUrls: ['./my-letters.component.css'],
  standalone: false,
})
export class MyLettersComponent {
  constructor(
    private letterService: LetterService,
    private toastService: ToastService
  ) {}
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
        this.toastService.error({
          message: 'Error fetching your letters: Please try again later',
          autohide: true,
        });
      },
    });
  }
}
