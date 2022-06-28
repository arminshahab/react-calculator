import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose_operation",
  CLEAR: "clear",
  DELETE: "delete",
  COMPUTE: "compute",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return { ...state, currentOperand: payload.digit, overwrite: false };
      }
      if (
        payload.digit === "." &&
        state.currentOperand &&
        state.currentOperand.includes(".")
      ) {
        return state;
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      return {
        ...state,
        currentOperand: (state.currentOperand || "") + payload.digit,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (!state.currentOperand && !state.previousOperand) return state;
      if (!state.previousOperand)
        return {
          previousOperand: state.currentOperand,
          currentOperand: null,
          operation: payload.operation,
        };
      if (state.previousOperand && !state.currentOperand) {
        return { ...state, operation: payload.operation };
      }
      return {
        currentOperand: null,
        previousOperand: compute(state),
        operation: payload.operation,
      };
    case ACTIONS.COMPUTE:
      if (!state.currentOperand || !state.previousOperand || !state.operation) {
        return state;
      }
      return {
        currentOperand: compute(state),
        previousOperand: null,
        operation: null,
        overwrite: true,
      };

    case ACTIONS.DELETE:
      if (!state.currentOperand) return state;
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };
      if (state.overwrite) {
        return { ...state, currentOperand: null, overwrite: false };
      }

      return { ...state, currentOperand: state.currentOperand.slice(0, -1) };
    case ACTIONS.CLEAR:
      return {};
    default:
      return state;
  }
};

const compute = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let computation;
  if (!isNaN(prev) || !isNaN(current)) {
    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      default:
        return {};
    }
  }
  return computation.toString();
};

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />{" "}
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.COMPUTE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
