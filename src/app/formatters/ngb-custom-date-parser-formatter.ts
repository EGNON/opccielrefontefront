import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Injectable} from "@angular/core";

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class NgbCustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    // console.log("DATE === ", date ? (date.day < 10 ? "0" + date.day : date.day) + this.DELIMITER + (date.month < 10 ? "0" + date.month : date.month) + this.DELIMITER + date.year : '');
    return date ? (date.day < 10 ? "0" + date.day : date.day) + this.DELIMITER + (date.month < 10 ? "0" + date.month : date.month) + this.DELIMITER + date.year : '';
  }
}
