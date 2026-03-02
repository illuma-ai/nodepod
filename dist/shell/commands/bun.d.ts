import type { ShellCommand } from "../shell-types";
import type { PmDeps } from "./pm-types";
export declare function createBunCommand(deps: PmDeps): ShellCommand;
export declare function createBunxCommand(deps: PmDeps): ShellCommand;
