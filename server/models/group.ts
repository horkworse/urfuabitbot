import {Mentor} from './mentor';
import {Institute} from './Institute';
import {Student} from './student';

export class Group {
  mentors: Array<Mentor>
  students: Array<Student>
  institute: Institute
}
