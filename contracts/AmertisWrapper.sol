// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./AmertisAdapter.sol";

abstract contract AmertisWrapper is AmertisAdapter {
    constructor(
        string memory name,
        uint256 gasEstimate
    ) AmertisAdapter(name, gasEstimate) {}

    function getTokensIn() external view virtual returns (address[] memory);

    function getTokensOut() external view virtual returns (address[] memory);

    function getWrappedToken() external view virtual returns (address);
}
