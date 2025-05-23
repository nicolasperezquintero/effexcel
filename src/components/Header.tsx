import { useDispatch, useSelector } from "react-redux";
import {
  applyCell,
  captureArrows,
  clearSelection,
  copySelectedToInput,
  setInputText,
} from "../store";
import { useEffect, useMemo, useRef } from "react";
import "../styles/Header.css";
import { useConvert } from "../hooks/useConvert";

const Header = () => {
  const { numberToCell } = useConvert();
  const inputText = useSelector((state: any) => {
    return state.sheet.inputText;
  });
  const selectedCell = useSelector((state: any) => {
    return state.sheet.selectedCell;
  });
  const isSelectedCell = useMemo(() => selectedCell != null, [selectedCell]);

  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectedCell != null && inputRef.current != null) {
      inputRef.current.focus();
      dispatch(copySelectedToInput());
    }
  }, [selectedCell]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setInputText(event.target.value));
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && selectedCell != null) {
      dispatch(applyCell());
      dispatch(clearSelection());
      return;
    }
  };
  const handleClick = () => {
    dispatch(captureArrows());
  };
  return (
    <div
      className="w-screen h-40 flex-col flex-grow-0 items-start w-screen sticky top-0 z-100"
      onClick={() => {
        dispatch(applyCell());
        dispatch(clearSelection());
      }}
    >
      <div className="w-screen h-25 text-white bg-green-700 p-1 flex p-4 flex-row filter drop-shadow items-center z-30 relative">
        <svg
          className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 180 36"
          style={{ width: "180px", height: "36px" }}
        >
          <svg
            color="white"
            width="180"
            height="36"
            viewBox="0 0 180 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="css-15y3y75"
          >
            <path
              d="M18.0322 35.9996L4.8999 22.866L18.0322 9.73242L20.225 11.9255L9.28554 22.866L20.225 33.8065L18.0322 35.9996Z"
              fill="white"
            ></path>
            <path
              d="M13.1342 4.9023L0 18.0415L2.19546 20.2366L15.3297 7.09735L13.1342 4.9023Z"
              fill="white"
            ></path>
            <path
              d="M18.0322 26.2425L15.8394 24.0495L26.7788 13.1089L15.8394 2.16839L18.0322 0L31.1645 13.1089L18.0322 26.2425Z"
              fill="white"
            ></path>
            <path
              d="M33.8048 15.8394L20.7036 28.9419L22.8988 31.1373L36 18.0348L33.8048 15.8394Z"
              fill="white"
            ></path>
            <path
              d="M178.245 14.7028C178.245 14.0985 177.697 13.6719 177.039 13.6719H175.76V16.7291H176.673V15.8049H177.002L177.441 16.7291H178.428L177.77 15.5916C178.062 15.4138 178.245 15.0939 178.245 14.7028ZM176.966 15.0939H176.673V14.4895H176.966C177.222 14.4895 177.331 14.5962 177.331 14.8095C177.331 14.9517 177.185 15.0939 176.966 15.0939Z"
              fill="white"
            ></path>
            <path
              d="M176.929 12.2144C175.212 12.2144 173.859 13.5652 173.859 15.2005C173.859 16.8714 175.248 18.1867 176.929 18.1867C178.647 18.1867 179.999 16.8358 179.999 15.2005C180.036 13.5652 178.647 12.2144 176.929 12.2144ZM176.929 17.9379C175.394 17.9379 174.152 16.7292 174.152 15.2005C174.152 13.7074 175.394 12.4632 176.929 12.4632C178.464 12.4632 179.707 13.6719 179.707 15.2005C179.707 16.7292 178.464 17.9379 176.929 17.9379Z"
              fill="white"
            ></path>
            <path
              d="M163.455 17.1451C161.745 16.6282 161.119 16.2703 161.119 15.3955C161.119 14.5605 161.828 14.0038 162.955 14.0038C164.248 14.0038 164.999 14.6797 165.416 15.5546L167.043 14.6797C166.292 13.2085 164.874 12.2144 162.955 12.2144C160.994 12.2144 159.2 13.3675 159.2 15.4353C159.2 17.5428 160.952 18.179 162.788 18.6959C164.54 19.2129 165.458 19.531 165.458 20.5251C165.458 21.3204 164.79 21.9964 163.289 21.9964C161.703 21.9964 160.786 21.2409 160.368 20.1275L158.7 21.042C159.325 22.7121 160.911 23.7858 163.205 23.7858C165.625 23.7858 167.335 22.5531 167.335 20.5251C167.335 18.3381 165.374 17.7416 163.455 17.1451Z"
              fill="white"
            ></path>
            <path
              d="M149.492 19.7256C149.492 21.0655 148.701 21.9993 146.994 21.9993C145.287 21.9993 144.495 21.0655 144.495 19.7256V12.2144H142.58V19.8068C142.58 22.2429 144.412 23.7858 146.994 23.7858C149.534 23.7858 151.407 22.2429 151.407 19.8068V12.2144H149.492V19.7256Z"
              fill="white"
            ></path>
            <path
              d="M126.845 14.0327H130.115V23.7858H132.018V14.0327H135.288V12.2144H126.845V14.0327Z"
              fill="white"
            ></path>
            <path
              d="M115.385 14.0099C116.825 14.0099 118.099 14.7281 118.675 15.8055L120.32 14.8878C119.333 13.2518 117.483 12.2144 115.385 12.2144C111.89 12.2144 109.382 14.768 109.382 18.0001C109.382 21.2321 111.89 23.7858 115.385 23.7858C117.524 23.7858 119.374 22.7483 120.32 21.1124L118.675 20.1947C118.099 21.3119 116.825 21.9902 115.385 21.9902C112.918 21.9902 111.273 20.2745 111.273 18.0001C111.273 15.7257 112.918 14.0099 115.385 14.0099Z"
              fill="white"
            ></path>
            <path
              d="M97.2943 18.8679H101.972V17.0496H97.2943V14.0327H102.39V12.2144H95.373V23.7858H102.473V21.9674H97.2943V18.8679Z"
              fill="white"
            ></path>
            <path
              d="M80.7891 14.0327H82.7268H82.8953H87.6974V12.2144H80.7891V14.0327Z"
              fill="white"
            ></path>
            <path
              d="M80.7891 17.2974V23.7856H82.7268V19.1157H87.5289V17.2974H82.8953H82.7268H80.7891Z"
              fill="white"
            ></path>
            <path
              d="M66.2046 14.0327H68.1423H68.3529H73.1129V12.2144H66.2046V14.0327Z"
              fill="white"
            ></path>
            <path
              d="M66.2046 17.2974V23.7856H68.1423V19.1157H72.9444V17.2974H68.3529H68.1423H66.2046Z"
              fill="white"
            ></path>
            <path
              d="M53.3499 18.8679H58.0277V17.0496H53.3499V14.0327H58.4454V12.2144H51.4287V23.7858H58.5289V21.9674H53.3499V18.8679Z"
              fill="white"
            ></path>
          </svg>
        </svg>
        <div className="h-10 ml-10 mr-10 bg-white w-px"></div>
        <div className="flex flex-row items-end">
          <h3 className="font-black text-4xl mr-2">Effexcel</h3>
          <h6 className="font-semibold">by el Nico</h6>
        </div>
      </div>
      <div className="w-screen h-15 bg-green-900 flex row pl-4 z-10 items-start">
        <div
          className={
            " bg-green-700 flex items-center justify-center p-3 flex-row h-10 rounded-b-lg z-20 transition-transform " +
            (isSelectedCell ? "translate-y-0" : "-translate-y-full")
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h5 className="font-semibold mr-3">
            Editar Celda {selectedCell ? numberToCell(selectedCell) : ""}
          </h5>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            className="rounded bg-white text-black pl-1"
            ref={inputRef}
            disabled={!isSelectedCell}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
