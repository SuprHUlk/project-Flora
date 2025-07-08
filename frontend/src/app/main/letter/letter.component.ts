import { Component } from '@angular/core';
import { LetterService } from 'src/services/letter.service';
import { Letter } from 'src/models/letter.model';
import { ToastService } from 'src/services/shared/toast.service';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css'],
  standalone: false,
})
export class LetterComponent {
  constructor(
    private letterService: LetterService,
    private toastService: ToastService
  ) {}
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
      this.toastService.error({
        message: 'Cannot send empty letters',
        autohide: true,
      });
      return;
    }

    const letterRequest: Letter = {
      message: this.letter,
    };

    this.letterService.send(letterRequest).subscribe({
      next: (res) => {
        console.log(res);
        this.toastService.show({
          message: 'Letter sent successfully',
          autohide: true,
        });
      },
      error: (err) => {
        console.log(err);
        this.toastService.error({
          message: 'Cannot send letter. Please refresh the page.',
          autohide: true,
        });
      },
      complete: () => {
        this.letter = '';
      },
    });
  }
}
