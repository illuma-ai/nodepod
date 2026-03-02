import type { ShellCommand } from "../shell-types";
import type { PmDeps } from "./pm-types";
export declare function createNodeCommand(deps: PmDeps): ShellCommand;
export declare function createNpxCommand(deps: PmDeps): ShellCommand;
