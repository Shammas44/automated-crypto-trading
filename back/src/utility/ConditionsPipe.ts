interface PipeableCondition {
  check(): boolean;
}
/**
 * @description Check whenever all conditions are fulfilled
 * @class ConditionsPipe
 * @parameter {PipeableCondition} conditions - collections of Conditions object implementing PipeableConditions
 *
 * @usage exemple
const pipe = new CondtionsPipe([
    new UserIsActiveAdmin(user),
    new UserCanEdit(user),
    new UserIsNotBlacklisted(user),
    new UserLivesInAvailableLocation(user)
])

if (pipe.check()){
    // do stuff
}
 */
class ConditionsPipe {
  private _conditions: PipeableCondition[];

  constructor(conditions: PipeableCondition[]) {
    this._conditions = conditions;
  }

  check(): boolean {
    return this._conditions.every((p) => p.check());
  }
}
