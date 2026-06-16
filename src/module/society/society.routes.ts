import { Router } from 'express';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/authenticate';
import { requireSuperAdmin } from '@/middlewares/requireSuperAdmin';
import {
  createSocietySchema,
  societyParamSchema,
  assignMemberSchema,
  removeMemberSchema,
} from './society.schema';
import {
  createSociety,
  getSocieties,
  getSociety,
  getMembers,
  assignMember,
  removeMember,
} from './society.controller';

export const societyRouter = Router();

societyRouter.use(authenticate, requireSuperAdmin);

societyRouter.post('/createSociety', validate(createSocietySchema), createSociety);
societyRouter.get('/getSocieties', getSocieties);
societyRouter.get('/:societyId/getSociety', validate(societyParamSchema), getSociety);
societyRouter.get('/:societyId/getMembers', validate(societyParamSchema), getMembers);
societyRouter.post('/:societyId/assignMember', validate(assignMemberSchema), assignMember);
societyRouter.delete(
  '/:societyId/removeMember/:userId',
  validate(removeMemberSchema),
  removeMember,
);
