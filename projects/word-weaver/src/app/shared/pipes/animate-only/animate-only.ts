import { Pipe, PipeTransform } from "@angular/core";
import { Pronoun } from "../../../../config/config";

@Pipe({
  name: "animateOnly",
  standalone: false,
})
export class AnimateOnlyPipe implements PipeTransform {
  // Returns only Animate pronouns

  transform(value: Pronoun[], ...args) {
    return value.filter((pn) => pn["gloss"].toLowerCase() !== "it");
  }
}
