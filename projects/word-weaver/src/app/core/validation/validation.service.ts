import { Injectable } from "@angular/core";
import { Validation } from "../../../config/config";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ValidationService {
  validation: Validation = environment.config.validation;

  validateConditions(
    conditions: any[],
    selection,
    item,
    logic = null
  ): boolean {
    const conditionsTruth = [];
    conditions.forEach((condition) => {
      if (condition.logic) {
        // recurse if logic operator present
        conditionsTruth.push(
          this.validateConditions(
            condition.conditions,
            selection,
            item,
            condition.logic
          )
        );
      } else {
        let method = item;
        if (condition["method"] === "selection") {
          method = selection;
          if (selection === null) {
            return false;
          }
        }
        if (condition["operator"] === "in") {
          conditionsTruth.push(
            condition["value"].indexOf(
              method[condition["methodKey"]][condition["itemKey"]]
            ) > -1
          );
        } else if (condition["operator"] === "eq") {
          conditionsTruth.push(
            condition["value"] ===
              method[condition["methodKey"]][condition["itemKey"]]
          );
        } else if (condition["operator"] === "truthy") {
          conditionsTruth.push(!!method[condition["methodKey"]]);
        } else {
          return false;
        }
      }
    });
    if (logic === "or") {
      return conditionsTruth.some((x) => x);
    } else if (!logic || logic === "and") {
      return conditionsTruth.every((x) => x);
    }
  }

  validate(actionType, scopeType, key, selection = null, item = null): boolean {
    if (this.validation && actionType in this.validation) {
      if (scopeType in this.validation[actionType]) {
        if (typeof this.validation[actionType][scopeType][key] === "boolean") {
          return this.validation[actionType][scopeType][key];
        } else if (
          typeof this.validation[actionType][scopeType][key] === "object"
        ) {
          return this.validateConditions(
            this.validation[actionType][scopeType][key],
            selection,
            item,
            this.validation[actionType][scopeType][key]["logic"]
          );
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
