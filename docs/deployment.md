# Deployment of the Boltz Backend

Deploying the Boltz backend has to be done with great care since it will have full control over the Lightning Node it is connected to. *With great power comes great responsibility.*

Prerequisites:

* The latest Node.js LTS release (`v12.16.3` as of writing this)
* `rsync` (needed to compile the TypeScript code)

The Boltz backend needs a synced Groestlcoin Core instance to connect to the Groestlcoin chain. These nodes need to:

* Have the transaction index enabled `txindex=1`
* Use a username and password to authenticate requests RPC (`rpcuser=<user>` and `rpcpassword=<password>`; the backend does not support cookie based authentication yet)
* Enable ZeroMQ streams for raw blocks and raw transactions (`zmqpubrawblock=tcp://<host>:<port>` and `zmqpubrawtx=tcp://<host>:<port>`)

If the Groestlcoin chain should also support Lightning, an [LND node](https://github.com/Groestlcoin/lnd) has to be running on the same chain. The LND node does not need to be configured in any special way but has to support `invoicesrpc`. This can be achieved by using an official release binary from the LND repository or by compiling LND with `-tags="invoicesrpc"`.

## Configuration

```toml
configpath = "/root/.boltz/boltz.conf"
dbpath = "/root/.boltz/boltz.db"
logpath = "/root/.boltz/boltz.log"
datadir = "/root/.boltz"

# This mnemonic is not for the wallet that holds the onchain coins
# but the claim and refund keys are derived from it
mnemonicpath = "/root/.boltz/seed.dat"

# Possible values are: error, warning, info, verbose, debug, silly
loglevel = "debug"

# This value configures the type of the lockup address of normal Submarine Swaps:
#   - false: P2SH nested P2WSH
#   - true: P2WSH
swapwitnessaddress = true

# Enables the prepay minerfee Reverse Swap procotol
# If this value is "true", an invoice for the miner fee has to be paid
# before hold invoice of the Revese Swap
prepayminerfee = true

# This is the REST API that should be exposed to the public
# It does not support HTTPS but only plaintext HTTP. A reverse
# proxy should be setup with a web server like Nginx
[api]
host = "127.0.0.1"
port = 9_001

# And this the gRPC API that is used by the boltz-cli executable
[grpc]
host = "127.0.0.1"
port = 9_000
certpath = "/root/.boltz/tls.cert"
keypath = "/root/.boltz/tls.key"

# The interval in seconds at which new rates for pairs that
# do not have a hardcoded rate should be updates
[rates]
interval = 1

# The Boltz Backend allows for backing up the LND channel backups and
# the database to a Google Cloud Storage Bucket
[backup]
email = ""
privatekeypath = ""
bucketname = ""
# Cron interval at which a new backup should be uploaded. The default value is daily
interval = "0 0 * * *"

# The Boltz backend supports sending messages to Discord after successful and failed
# Swaps and if the wallet or channel balance is underneath a configurable threshold
[notification]
token = ""
channel = ""
prefix = ""
# Interval in minutes at which the wallet and channel balances should be checked
interval = 1
# Some Discord commands (like withdraw) require a TOTP token
# This is the path to the secret of that TOTP token
otpsecretpath = "/root/.boltz/otpSecret.dat"

# The array "pairs" configures the trading pairs that Boltz should support
# A pair can have the following options:
# - "base" (required): base currency
# - "quote" (required): quote currency
# - "timeoutDelta": after how many minutes a Swap of that pair should timeout
# - "rate": the rate for a pair can be hardcoded (only sensible for same currency pairs);  
#           if the rate is not hardcoded the mean value from these exchanges will be used:
#             - Binance
#             - Bitfinex
#             - Coinbase Pro
#             - Kraken
#             - Poloniex
# - "fee": percentage of the swapped amount that should be charged as fee

[[pairs]]
base = "GRS"
quote = "GRS"
rate = 1
timeoutDelta = 400

# The array "currencies" configures the chain and LND clients for the "pairs"
# Not configuring the LND client is possible but will cause that chain not to support Lightning
# The values are pretty self explainatory apart from: "minWalletBalance" and "minChannelBalance" which trigger
# a Discord notification
[[currencies]]
symbol = "GRS"
network = "bitcoinTestnet"
minWalletBalance = 10_000_000
minChannelBalance = 10_000_000
maxSwapAmount = 10_000_000
minSwapAmount = 10_000
maxZeroConfAmount = 10_000_000

  [currencies.chain]
  host = "127.0.0.1"
  port = 17_766
  rpcuser = "groestlcoin"
  rpcpass = "groestlcoin"

  [currencies.lnd]
  host = "127.0.0.1"
  port = 10_009
  certpath = "/root/.lnd-grs/tls.cert"
  macaroonpath = "/root/.lnd-grs/data/chain/groestlcoin/testnet/admin.macaroon"

[[currencies]]
symbol = "GRS"
network = "bitcoinMainnet"
minWalletBalance = 10_000_000
minChannelBalance = 10_000_000
maxSwapAmount = 10_000_000
minSwapAmount = 10_000
maxZeroConfAmount = 10_000_000

  [currencies.chain]
  host = "127.0.0.1"
  port = 14_41
  rpcuser = "groestlcoin"
  rpcpass = "groestlcoin"

  [currencies.lnd]
  host = "127.0.0.1"
  port = 10_009
  certpath = "/root/.lnd-grs/tls.cert"
  macaroonpath = "/root/.lnd-grs/data/chain/groestlcoin/mainnet/admin.macaroon"

```
