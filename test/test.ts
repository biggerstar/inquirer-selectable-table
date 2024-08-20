import inquirer from "inquirer";
import {SelectTableTablePrompt} from "../src";

inquirer.registerPrompt("table", SelectTableTablePrompt);

const prompts = {
  scanPack() {
    return inquirer['prompt'](
      [
        {
          type: "table",
          name: "packInfo",
          message: "",
          pageSize: 6,
          columns: [
            {
              name: "firstName",
              value: "firstName",
            },
            {
              name: "lastName",
              value: "lastName"
            },
            {
              name: "location",
              value: "location"
            }
          ],
          rows: [
            {
              firstName: "Abel11111111",
              lastName: "Naz 跳一跳eh000000000",
              location: "Nige跳一跳r9999"
            },
            {
              firstName: "Daniel",
              lastName: "Ruiz",
              location: "Spain"
            },
            {
              firstName: "John",
              lastName: "Doe",
              location: "Leaf Village"
            },
            {
              firstName: "Kakashi",
              lastName: "Hatake",
              location: "Leaf Village"
            },
            {
              firstName: "Daniel",
              lastName: "Ruiz",
              location: "Spain"
            },
            {
              firstName: "John",
              lastName: "Doe",
              location: "Leaf Village"
            },
            {
              firstName: "Kakashi",
              lastName: "Hatake",
              location: "Leaf Village"
            },
            {
              firstName: "Daniel",
              lastName: "Ruiz",
              location: "Spain"
            },
            {
              firstName: "John",
              lastName: "Doe",
              location: "Leaf Village"
            },
            {
              firstName: "Kakashi",
              lastName: "Hatake",
              location: "Leaf Village"
            },
            {
              firstName: "Daniel",
              lastName: "Ruiz",
              location: "Spain"
            },
            {
              firstName: "John",
              lastName: "Doe",
              location: "Leaf Village"
            },
            {
              firstName: "Kakashi",
              lastName: "Hatake",
              location: "Leaf Village"
            },
          ]
        }
      ]
    )
  }
}
prompts.scanPack()
