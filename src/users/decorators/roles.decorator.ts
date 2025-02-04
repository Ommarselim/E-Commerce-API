import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/utilities/constants';
import { UserRole } from 'src/utilities/enums';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);