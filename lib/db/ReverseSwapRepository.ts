import { WhereOptions } from 'sequelize';
import { SwapUpdateEvent } from '../consts/Enums';
import ReverseSwap, { ReverseSwapType } from './models/ReverseSwap';

class ReverseSwapRepository {
  public getReverseSwaps = (options?: WhereOptions): Promise<ReverseSwap[]> => {
    return ReverseSwap.findAll({
      where: options,
    });
  }

  public getReverseSwap = (options: WhereOptions): Promise<ReverseSwap | null> => {
    return ReverseSwap.findOne({
      where: options,
    });
  }

  public addReverseSwap = (reverseSwap: ReverseSwapType): Promise<ReverseSwap> => {
    return ReverseSwap.create(reverseSwap);
  }

  public setReverseSwapStatus = (reverseSwap: ReverseSwap, status: string): Promise<ReverseSwap> => {
    return reverseSwap.update({
      status,
    });
  }

  public setLockupTransaction = (reverseSwap: ReverseSwap, transactionId: string, vout: number, minerFee: number): Promise<ReverseSwap> => {
    return reverseSwap.update({
      minerFee,
      transactionId,
      transactionVout: vout,
      status: SwapUpdateEvent.TransactionMempool,
    });
  }

  public setInvoiceSettled = (reverseSwap: ReverseSwap, preimage: string): Promise<ReverseSwap> => {
    return reverseSwap.update({
      preimage,
      status: SwapUpdateEvent.InvoiceSettled,
    });
  }

  public setTransactionRefunded = (reverseSwap: ReverseSwap, minerFee: number): Promise<ReverseSwap> => {
    return reverseSwap.update({
      minerFee: reverseSwap.minerFee + minerFee,
      status: SwapUpdateEvent.TransactionRefunded,
    });
  }

  public dropTable = (): Promise<void> => {
    return ReverseSwap.drop();
  }
}

export default ReverseSwapRepository;
