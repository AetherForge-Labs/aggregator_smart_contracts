//  ,ggg, ,ggg,_,ggg,     _,gggggg,_      ,ggg, ,ggggggg,             ,ggg,      ,gg,
// dP""Y8dP""Y88P""Y8b  ,d8P""d8P"Y8b,   dP""Y8,8P"""""Y8b           dP""8I     i8""8i
// Yb, `88'  `88'  `88 ,d8'   Y8   "8b,dPYb, `8dP'     `88          dP   88     `8,,8'
//  `"  88    88    88 d8'    `Ybaaad88P' `"  88'       88         dP    88      `Y88aaad8
//      88    88    88 8P       `""""Y8       88        88        ,8'    88       d8""""Y8,
//      88    88    88 8b            d8       88        88        d88888888      ,8P     8b
//      88    88    88 Y8,          ,8P       88        88  __   ,8"     88      dP      Y8
//      88    88    88 `Y8,        ,8P'       88        88 dP"  ,8P      Y8  _ ,dP'      I8
//      88    88    Y8, `Y8b,,__,,d8P'        88        Y8,Yb,_,dP       `8b,"888,,_____,dP
//      88    88    `Y8   `"Y8888P"'          88        `Y8 "Y8P"         `Y8a8P"Y888888P"

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Query {
    address adapter;
    address tokenIn;
    address tokenOut;
    uint256 amountOut;
}
struct Offer {
    bytes amounts;
    bytes adapters;
    bytes path;
    uint256 gasEstimate;
}
struct FormattedOffer {
    uint256[] amounts;
    address[] adapters;
    address[] path;
    uint256 gasEstimate;
}
struct Trade {
    uint256 amountIn;
    uint256 amountOut;
    address[] path;
    address[] adapters;
}

interface IAmertisRouter {
    event UpdatedTrustedTokens(address[] _newTrustedTokens);
    event UpdatedAdapters(address[] _newAdapters);
    event UpdatedMinFee(uint256 _oldMinFee, uint256 _newMinFee);
    event UpdatedFeeClaimer(address _oldFeeClaimer, address _newFeeClaimer);
    event AmertisSwap(
        address indexed _tokenIn,
        address indexed _tokenOut,
        uint256 _amountIn,
        uint256 _amountOut
    );

    // admin
    function setTrustedTokens(address[] memory _trustedTokens) external;

    function setAdapters(address[] memory _adapters) external;

    function setFeeClaimer(address _claimer) external;

    function setMinFee(uint256 _fee) external;

    // misc
    function trustedTokensCount() external view returns (uint256);

    function adaptersCount() external view returns (uint256);

    // query

    function queryAdapter(
        uint256 _amountIn,
        address _tokenIn,
        address _tokenOut,
        uint8 _index
    ) external returns (uint256);

    function queryNoSplit(
        uint256 _amountIn,
        address _tokenIn,
        address _tokenOut,
        uint8[] calldata _options
    ) external view returns (Query memory);

    function queryNoSplit(
        uint256 _amountIn,
        address _tokenIn,
        address _tokenOut
    ) external view returns (Query memory);

    function findBestPathWithGas(
        uint256 _amountIn,
        address _tokenIn,
        address _tokenOut,
        uint256 _maxSteps,
        uint256 _gasPrice
    ) external view returns (FormattedOffer memory);

    function findBestPath(
        uint256 _amountIn,
        address _tokenIn,
        address _tokenOut,
        uint256 _maxSteps
    ) external view returns (FormattedOffer memory);

    // swap

    function swapNoSplit(
        Trade calldata _trade,
        address _to,
        uint256 _fee
    ) external;

    function swapNoSplitFromNative(
        Trade calldata _trade,
        address _to,
        uint256 _fee
    ) external payable;

    function swapNoSplitToNative(
        Trade calldata _trade,
        address _to,
        uint256 _fee
    ) external;

    function swapNoSplitToNativeWithPermit(
        Trade calldata _trade,
        address _to,
        uint256 _fee,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external;

    function swapNoSplitWithPermit(
        Trade calldata _trade,
        address _to,
        uint256 _fee,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external;
}
