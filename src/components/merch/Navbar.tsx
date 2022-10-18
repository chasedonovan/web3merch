import React, { useState } from "react";
import { MerchConnectBtn } from "../merch/MerchConnectBtn";
import { useWalletContext } from "../../hooks/useWalletContext";

type Props = {
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  showCart: boolean;
  cartCount: number;
};

export default function Navbar(props: Props) {
  const { isConnected } = useWalletContext();

  return (
    <div
      className={`relative z-30 w-full h-20 min-h-max border-b dark:bg-black border-[#2C2D33] flex flex-row text-center content-center p-2 ${
        isConnected ? "justify-between" : "justify-center"
      }`}
    >
      {/* <div
      className={`relative z-30 w-full h-20 min-h-max border-b dark:bg-[#0D0D0D] border-[#2C2D33] flex flex-row text-center content-center p-2 justify-between`}
    > */}
      <div className="self-center flex flex-row p-2 min-w-min gap-4 divide-x">
        <img
          src={"/uniscroll-full.webp"}
          alt=""
          className="self-center sm:w-[124px]"
        />
        {/* <img
          src="/goat-logo.png"
          className="pl-2 h-12 sm:h-16 my-2 mx-auto self-center"
        /> */}
      </div>
      {isConnected && (
        <div className="relative flex flex-row self-center">
          {props.cartCount > 0 && (
          <div 
          onClick={() => {
            props.setCartOpen(true);
            props.setShowCart(!props.showCart);
          }}
          className="hover:cursor-pointer absolute bg-white border border-gray-500 shadow-md shadow-gray-400 left-[28px] w-5 h-5 rounded-full text-black text-sm">
            {props.cartCount}
          </div>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-9 h-9 self-center mr-4 hover:cursor-pointer shadow-white"
            onClick={() => {
              props.setCartOpen(true);
              props.setShowCart(!props.showCart);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <MerchConnectBtn />
        </div>
      )}
    </div>
  );
}
