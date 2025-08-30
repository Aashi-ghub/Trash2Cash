"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, Shield, Clock, CheckCircle } from "lucide-react"

export default function ProofsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blockchain Proofs</h1>
          <p className="text-gray-600">Transparent verification of all deposits and token transactions</p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Shield className="w-5 h-5" />
              Transparency & Trust
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800">
              Every deposit and token transaction is recorded on the blockchain for complete transparency. You can
              verify any transaction using the blockchain explorer links below.
            </p>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Transactions</CardTitle>
            <CardDescription>Find specific deposits or token transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input placeholder="Search by transaction hash, bin ID, or date..." className="w-full" />
              </div>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Proofs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Blockchain Proofs</CardTitle>
            <CardDescription>Latest verified deposits and token transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Bin ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Blockchain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>2 min ago</span>
                    </div>
                  </TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>BIN-001</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">HV</Badge>
                  </TableCell>
                  <TableCell>8 T2C</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>5 min ago</span>
                    </div>
                  </TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>BIN-002</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">LV</Badge>
                  </TableCell>
                  <TableCell>3 T2C</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>12 min ago</span>
                    </div>
                  </TableCell>
                  <TableCell>Reward Redemption</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-50 T2C</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>18 min ago</span>
                    </div>
                  </TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>BIN-001</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-100 text-orange-800">ORG</Badge>
                  </TableCell>
                  <TableCell>2 T2C</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>25 min ago</span>
                    </div>
                  </TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>BIN-003</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">HV</Badge>
                  </TableCell>
                  <TableCell>12 T2C</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Blockchain Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">Polygon Testnet</div>
              <p className="text-xs text-muted-foreground">Fast & eco-friendly</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">12,847</div>
              <p className="text-xs text-muted-foreground">All time verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Gas Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">~₹0.08</div>
              <p className="text-xs text-muted-foreground">Average per transaction</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
