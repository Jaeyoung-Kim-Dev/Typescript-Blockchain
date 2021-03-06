import * as CryptoJS from 'crypto-js';

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public timestamp: number;
  public data: string;

  static caculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean => {
    return (
      typeof aBlock.index === 'number' &&
      typeof aBlock.hash === 'string' &&
      typeof aBlock.previousHash === 'string' &&
      typeof aBlock.timestamp === 'number' &&
      typeof aBlock.data === 'string'
    );
  };

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, '2020202020', '', 'Hello', 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;
const getLastestBlock = (): Block => blockchain[blockchain.length - 1];
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLastestBlock();
  const newIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = getNewTimeStamp();
  const nextHash: string = Block.caculateBlockHash(
    newIndex,
    previousBlock.hash,
    nextTimestamp,
    data
  );
  const newBlock = new Block(
    newIndex,
    nextHash,
    previousBlock.hash,
    data,
    nextTimestamp
  );
  blockchain.push(newBlock);
  return newBlock;
};

console.log(createNewBlock('Hi'), createNewBlock('Bye'));

const getHashforBlock = (aBlock: Block): string =>
  Block.caculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean =>
  Block.validateStructure(candidateBlock) &&
  Block.validateStructure(previousBlock) &&
  candidateBlock.index - 1 === previousBlock.index &&
  candidateBlock.previousHash === previousBlock.hash &&
  candidateBlock.hash === getHashforBlock(candidateBlock);

console.log(isBlockValid(blockchain[1], blockchain[0]));
// console.log(blockchain);

export {};
