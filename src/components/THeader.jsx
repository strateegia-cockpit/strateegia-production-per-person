import React from "react";
import { Th } from "@chakra-ui/react";


export const THeader = ({ text, weight, alignment, width, maxWidth }) => {
  
    return (
      <Th
        textTransform="lowercase"
        textAlign={alignment || "center"}
        fontWeight={weight || 500}
        className="biggerTh"
        fontFamily="Montserrat, sans-serif"
        fontSize={16}
        minW={width || "auto"}
        size={maxWidth || "auto"}
      >
        {text || ""}
      </Th>
    );
  };
  
 