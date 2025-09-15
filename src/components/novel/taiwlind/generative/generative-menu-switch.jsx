"use client";

import * as React from "react";

const GenerativeMenuSwitch = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <div className="flex items-center space-x-1 rounded-md p-1 text-sm font-medium text-muted-foreground">
      {children}
    </div>
  );
};

export default GenerativeMenuSwitch;
