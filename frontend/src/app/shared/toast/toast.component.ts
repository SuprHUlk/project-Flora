import { Component, inject } from '@angular/core';
import { ToastService } from 'src/services/toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toast',
  imports: [NgbToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
