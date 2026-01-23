import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "decapitalize",
  standalone: false,
})
export class DecapitalizePipe implements PipeTransform {
  transform(value: any) {
    // Move all uppercase characters to lowercase except 'I'
    const find = /([A-H,J-Z]|I\w)/;
    const re = new RegExp(find, "g");
    value = value.replace(re, (v: string) => v.toLowerCase());
    return value;
  }
}
