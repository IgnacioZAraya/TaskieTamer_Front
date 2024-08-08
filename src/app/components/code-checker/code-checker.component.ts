import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { IUserSpec } from "../../interfaces";

@Component({
  selector: "app-code-checker",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./code-checker.component.html",
  styleUrl: "./code-checker.component.scss",
})
export class CodeCheckerComponent {
  handleAction(_t2: any) {
    throw new Error("Method not implemented.");
  }
  toastSvc = inject(ToastrService);

  @Input() title!: string;
  @Input() action!: string;
  @Input() userSpec: IUserSpec = {
    email: "",
    lastname: "",
    password: "",
    name: "",
  };
}
