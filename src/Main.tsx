import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import Header from "./Header";

// Dialog
import DialogEncrypted from "./dialog/encrypted";
import DialogEncryptClearConfirmation from "./dialog/encryptClearConfirmation";
import DialogMalformedConfirmation from "./dialog/malformedConfirmation";
import DialogNewData from "./dialog/newData";

// Pages

import CLogic from "./CLogic";
import React from "react";

let cLogicInstance = new CLogic();
(globalThis as any).cLogic = cLogicInstance;

export default class Main extends React.Component {
  state: {
    extDOM: JSX.Element | null
  } = {
    extDOM: null
  }

  componentDidMount() {
    this.reload();
  }

  setExtDOM(v: JSX.Element | null) {
    this.setState({
      ...this.state,
      extDOM: v
    })
  }

  reload() {
    let setExtDOM = this.setExtDOM.bind(this);

    let readStatus = cLogicInstance.readData();
    switch (readStatus) {
      case "ENCRYPTED":
        let d = <DialogEncrypted callback={(cbData: string | boolean, cf: Function) => {
          if (typeof cbData === "boolean") {
            setExtDOM(<DialogEncryptClearConfirmation cb={(confirm: boolean) => {
              if (!confirm) {
                setExtDOM(d);
                cf();
              } else {
                cLogicInstance.voidData();
                setExtDOM(null);
              }
            }} />);
          } else {
            // Attempting to decrypt
            readStatus = cLogicInstance.readData(cbData);
            switch (readStatus) {
              case "OK":
                setExtDOM(null);
                break;
              case "MALFORMED":
                setExtDOM(
                  <DialogMalformedConfirmation />
                )
                break;
              case "DECFAULT":
                setExtDOM(d);
                cf("The passphrase you entered is not valid.");
                break;
              case "ENCRYPTED":
                setExtDOM(d);
                cf("Please enter passphrase.");
                break;
              default:
                setExtDOM(d);
                cf("Something went wrong: CLogic returned " + readStatus);
            }
          }
        }} />;

        setExtDOM(d)
        break;
      case "MALFORMED":
        setExtDOM(
          <DialogMalformedConfirmation />
        )
        break;
      case "NEW":
        setExtDOM(
          <DialogNewData />
        )
        break;
    }
  }

  render() {
    return (
      <Router>
        <Header />
        {this.state.extDOM}
        <Routes>

        </Routes>
      </Router>
    )
  }
}
