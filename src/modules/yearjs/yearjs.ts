const k = 1000;
const mil = k * k;
const bil = k * mil;

export class YearJs {
  private year: number;

  constructor(year?: number | string | YearJs) {
    if (year === undefined) {
      this.year = new Date().getFullYear();
    } else if (typeof year === "object") {
      this.year = year.valueOf();
    } else {
      this.year = this.parseYear(year);
    }
  }

  /**
   * Adds the specified number of years to the current year.
   */
  add(value: number): YearJs {
    if (!Number.isInteger(value)) {
      throw new Error("The value to add must be an integer.");
    }
    this.year += value;
    return this;
  }

  /**
   * Subtracts the specified number of years from the current year.
   */
  subtract(value: number): YearJs {
    if (!Number.isInteger(value)) {
      throw new Error("The value to subtract must be an integer.");
    }
    this.year -= value;
    return this;
  }

  str(value: number, measure: string): string {
    if (value === 0) return '0';
    return `${value}${measure}`
  }

  /**
   * Formats the year based on the provided pattern.
   */
  format(pattern: string): string {
    switch (pattern) {
      case "YYYY":
        return this.year.toString();
      case "YY":
        return this.year.toString().slice(-2);
      case "K":
        if (this.year % bil === 0) return this.str((this.year / bil), 'B');
        if (Math.abs(this.year) > bil) return this.str((this.year / bil), 'B');
        if (this.year % mil === 0) return this.str((this.year / mil), 'M');
        if (Math.abs(this.year) > mil) return this.str((this.year / mil), 'M');
        if (this.year % k === 0) return this.str((this.year / k), 'K');
        return this.year.toString();
      default:
        throw new Error(`Unknown format pattern: ${pattern}`);
    }
  }

  /**
   * Returns the year as a number.
   */
  valueOf(): number {
    return this.year;
  }

  /**
   * Returns the year as a string.
   */
  toString(): string {
    return this.year.toString();
  }

  /**
   * Returns is year after big bang and before today
   */
  isValid(): boolean {
    const bigBang = -13.8 * bil;
    const now = new Date().getFullYear();
    return this.year > bigBang && this.year < now;
  }

  /**
   * Parses the input and converts it into a valid year.
   */
  private parseYear(year: number | string): number {
    const parsedYear = typeof year === "string" ? parseInt(year, 10) : year;
    if (isNaN(parsedYear)) {
      throw new Error("Invalid year input. Must be a valid number or string.");
    }
    return parsedYear;
  }
}

const yearjs = (year?: number | string | YearJs): YearJs => new YearJs(year);

export default yearjs;
