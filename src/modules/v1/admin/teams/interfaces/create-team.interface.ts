import { StatusType } from '../../../../../enums/statuses.enum';

export interface CreateTeamInterface {
  name: string;

  order: number;

  status: StatusType;

  isDeleted: boolean;
}
