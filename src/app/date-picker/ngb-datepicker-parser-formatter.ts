import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export class NgbDateMomentParserFormatter extends NgbDateParserFormatter {
    constructor(private momentFormat: string) {
        super();
        //console.log('dateparser init');
    };
    format(date: NgbDateStruct): string {
        //console.log("date format started");
        if (date === null) {
            return '';
        }
        let d = moment({ year: date.year, 
                         month: date.month - 1, 
                         date: date.day });
        return d.isValid() ? d.format(this.momentFormat) : '';
    }

    parse(value: string): NgbDateStruct {
        //console.log('date parse started');
        if (!value) {
            return null;
        }
        let d = moment(value, this.momentFormat);
        return d.isValid() ? { year: d.year(), 
                               month: d.month() + 1, 
                               day: d.date() } : null;
    }
}