import {NgbDateAdapter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Injectable} from "@angular/core";

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class NgbCustomDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.toString().split(this.DELIMITER);
      console.log("VALUE111111111 === ", value);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? (date.day < 10 ? "0" + date.day : date.day) + this.DELIMITER + (date.month < 10 ? "0" + date.month : date.month) + this.DELIMITER + date.year : null;
  }
}
