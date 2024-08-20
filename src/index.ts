import {map, takeUntil} from "rxjs/operators";
// @ts-ignore
import Table from "cli-table";
import observe from "inquirer/lib/utils/events";
import Choices from "inquirer/lib/objects/choices";
import Base from "inquirer/lib/prompts/base";
import cliCursor from "cli-cursor";
import chalk from "chalk";
import {Interface as ReadLineInterface} from "readline";
import type {Answers, Question} from "inquirer";

type TQuestionOptions = {
  columns: Array<Record<string, string>>,
  rows: Array<Record<string, string>>,
  pageSize: number
}

export class SelectTableTablePrompt extends Base<Question & TQuestionOptions> {
  public spaceKeyPressed: boolean
  public columns: Choices
  public rows: Choices
  public pointer: number
  public horizontalPointer: number
  public pageSize: number
  public rowValues: any
  public done: Function

  constructor(
    questions: TQuestionOptions,
    rl: ReadLineInterface,
    answers: Answers
  ) {
    super(questions, rl, answers);
    this.columns = new Choices(this.opt.columns, []);
    this.pointer = 0;
    this.horizontalPointer = 0;
    this.rows = new Choices(this.opt.rows, []);
    this.rowValues = this.rows
      // @ts-ignore
      .filter(() => true)
      .map((value) => value);

    this.pageSize = this.opt.pageSize || 5;
  }

  /**
   * Start the inquirer session
   */
  _run(callback: Function) {
    this.done = callback;

    const events = observe(this.rl);
    const validation = this.handleSubmitEvents(
      events.line.pipe(map(this.getCurrentValue.bind(this)))
    );
    validation.success.forEach(this.onEnd.bind(this)).then();
    validation.error.forEach(this.onError.bind(this)).then();

    events.normalizedUpKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onUpKey.bind(this)).then();
    events.normalizedDownKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onDownKey.bind(this)).then();

    if (this.rl.line) {
    }
    cliCursor.hide();
    this.render();

    return this;
  }

  getCurrentValue() {
    return {...this.rowValues[this.pointer]};
  }

  onDownKey() {
    const length = this.rows.realLength;

    this.pointer = this.pointer < length - 1 ? this.pointer + 1 : this.pointer;
    this.render();
  }

  onEnd(state: any) {
    this.status = "answered";
    this.spaceKeyPressed = true;

    this.render();

    this.screen.done();
    cliCursor.show();
    this.done(state.value);
  }

  onError(state: any) {
    this.render(state.isValid);
  }

  onUpKey() {
    this.pointer = this.pointer > 0 ? this.pointer - 1 : this.pointer;
    this.render();
  }

  paginate() {
    const middleOfPage = Math.floor(this.pageSize / 2);
    const firstIndex = Math.max(0, this.pointer - middleOfPage);
    const lastIndex = Math.min(
      firstIndex + this.pageSize - 1,
      this.rows.realLength - 1
    );
    const lastPageOffset = this.pageSize - 1 - lastIndex + firstIndex;

    return [Math.max(0, firstIndex - lastPageOffset), lastIndex];
  }

  renderCallback(_table: any) {
  }

  render(error?: string) {
    let message = this.getQuestion();
    let bottomContent = "";

    if (!this.spaceKeyPressed) {
      message +=
        "\n (Press " +
        chalk.cyan.bold("<space>") +
        " to select, " +
        chalk.cyan.bold("<Up and Down>");
    }

    const [firstIndex, lastIndex] = this.paginate();
    const table = new Table({
      chars: {
        middle: "",
        "top-mid": "",
        "bottom-mid": "",
        "right-mid": "│",
        "mid-mid": "",
        "left-mid": "│",
        mid: " ",
      },
      head: [chalk.reset.dim(``)].concat(
        this.columns
          .pluck("name")
          .map((name) => chalk.reset.bold(chalk.yellow(name)))
      ),
      // colWidths: [0, 40, 40, 40],
      // colAligns: ['middle', 'middle', 'middle', 'middle'],
      style: {
        "padding-left": 1,
        "padding-right": 1,
      },
    });
    this.renderCallback(table);
    this.rows.forEach((row, rowIndex) => {
      if (rowIndex < firstIndex || rowIndex > lastIndex) return;
      const chalkModifier =
        this.status !== "answered" && this.pointer === rowIndex
          ? chalk.reset.bold.cyan
          : chalk.reset;
      //  delete the inquirer name, value, short and disable before pushing

      delete row["name"];
      delete row["short"];
      delete row["value"];
      delete row["disabled"];

      table.push({
        [""]: Object.values(row).map((value) =>
          value === undefined ? "" : chalkModifier(value)
        ),
      });
    });

// console.log(table.options)
    message = table.toString();
    if (error) {
      bottomContent = chalk.red(">> ") + error;
    }
    this.screen.render(message, bottomContent);
  }
}
