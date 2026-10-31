import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  Battery,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { calculateBOM, type BOMResult } from '@/lib/bom/calculator'

export function ConfiguratorPage() {
  const [capacityKw, setCapacityKw] = useState(3)
  const [systemType, setSystemType] = useState<'on-grid' | 'off-grid'>('on-grid')
  const [cableLengthMeters, setCableLengthMeters] = useState(30)

  const bom: BOMResult = calculateBOM(capacityKw, systemType, cableLengthMeters)

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
            <span>Engineering & Pricing</span>
            <span>•</span>
            <span className="text-[#172747]">1 kW to 5 kW Sizing Engine</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
            Solar System Configurator & BOM Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Configure On-Grid and Off-Grid packages with automatic Bill of Materials, component quantities, and PM Surya Ghar subsidies.
          </p>
        </div>

        <Link to="/app/quotations">
          <Button variant="default" className="bg-[#172747] text-white hover:bg-[#1E345E]">
            <FileText className="h-4 w-4 mr-1 text-[#FFDDB7]" />
            Go to Commercial Quotations
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Interactive Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
              <CardTitle className="text-base font-bold text-[#172747]">
                System Architecture Parameters
              </CardTitle>
              <p className="text-xs text-[#827B73]">Select target capacity and grid interconnect mode</p>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
              {/* Capacity Selector (1-5 kW) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#292522]">
                  <span>Target Rated Capacity</span>
                  <span className="text-[#172747] text-sm">{capacityKw} kW System</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setCapacityKw(kw)}
                      className={`py-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                        capacityKw === kw
                          ? 'bg-[#172747] text-white shadow-warm-sm border border-[#172747]'
                          : 'bg-[#F7F3EC] text-[#292522] hover:bg-[#EAE1DC] border border-[#E8E0D6]'
                      }`}
                    >
                      {kw} kW
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#827B73]">
                  Requires approximately ~{bom.estimatedRoofAreaSqFt} sq ft of shadow-free rooftop space.
                </p>
              </div>

              {/* System Type Toggle */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#292522] block">
                  Grid Connection Topology
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSystemType('on-grid')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      systemType === 'on-grid'
                        ? 'border-[#172747] bg-[#172747]/5 shadow-xs'
                        : 'border-[#E8E0D6] bg-white hover:bg-[#F7F3EC]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#172747]" />
                      <strong className="text-xs font-bold text-[#172747]">On-Grid System</strong>
                    </div>
                    <p className="text-[11px] text-[#827B73] mt-1 leading-snug">
                      Grid-tied net metering without battery maintenance. Maximum ROI.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSystemType('off-grid')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      systemType === 'off-grid'
                        ? 'border-[#493027] bg-[#493027]/5 shadow-xs'
                        : 'border-[#E8E0D6] bg-white hover:bg-[#F7F3EC]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-[#493027]" />
                      <strong className="text-xs font-bold text-[#493027]">Off-Grid System</strong>
                    </div>
                    <p className="text-[11px] text-[#827B73] mt-1 leading-snug">
                      Includes 48V LiFePO4 battery energy storage for 100% blackout resilience.
                    </p>
                  </button>
                </div>
              </div>

              {/* Cable Run Distance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#292522]">
                  <span>Roof to Meter Cable Distance</span>
                  <span className="font-mono text-[#172747]">{cableLengthMeters} meters</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={cableLengthMeters}
                  onChange={(e) => setCableLengthMeters(Number(e.target.value))}
                  className="w-full accent-[#172747]"
                />
                <p className="text-[11px] text-[#827B73]">
                  Dynamically adjusts Polycab 4 sq mm double-insulated DC solar wire quantity.
                </p>
              </div>

              {/* Daily Energy & Output Metrics */}
              <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#827B73]">
                  Simulated Generation Telemetry
                </span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E8E0D6]">
                    <span className="text-[10px] text-[#827B73]">Daily Output</span>
                    <p className="font-display text-lg font-bold text-[#172747] tabular-nums">
                      ~{bom.estimatedDailyKwh} <span className="text-xs font-normal">kWh/day</span>
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E8E0D6]">
                    <span className="text-[10px] text-[#827B73]">Monthly Units</span>
                    <p className="font-display text-lg font-bold text-[#2D5A43] tabular-nums">
                      ~{Math.round(bom.estimatedDailyKwh * 30)} <span className="text-xs font-normal">Units</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Generated Bill of Materials (BOM) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#172747]">
                    Generated Bill of Materials (BOM)
                  </CardTitle>
                  <p className="text-xs text-[#827B73]">
                    {bom.recommendedPanelCount} Panels (540W Mono PERC) • {capacityKw} kW Inverter Architecture
                  </p>
                </div>
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-[#172747] text-white">
                  {bom.items.length} Line Items
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F3EC] border-b border-[#E8E0D6] h-9 text-[#827B73] font-semibold uppercase">
                      <th className="px-4">Component & Specification</th>
                      <th className="px-3 text-center">Qty</th>
                      <th className="px-3 text-right">Unit Rate</th>
                      <th className="px-4 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D6]">
                    {bom.items.map((item) => (
                      <tr key={item.id} className="h-11 hover:bg-[#F7F3EC]/50 transition-colors">
                        <td className="px-4 py-2">
                          <p className="font-semibold text-[#292522]">{item.productName}</p>
                          <p className="text-[11px] text-[#827B73] truncate max-w-sm">
                            {item.specifications}
                          </p>
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-[#292522]">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-3 py-2 text-right text-[#827B73] tabular-nums font-mono">
                          ₹{item.unitCost.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-[#292522] tabular-nums font-mono">
                          ₹{item.totalCost.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing & Commercial Summary Strip */}
              <div className="p-5 border-t border-[#E8E0D6] bg-[#F7F3EC]/30 space-y-2 text-xs">
                <div className="flex justify-between text-[#827B73]">
                  <span>Equipment & Materials Subtotal:</span>
                  <span className="font-mono text-[#292522]">₹{bom.totalEquipmentCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#827B73]">
                  <span>Rooftop Installation, Commissioning & Safety Testing:</span>
                  <span className="font-mono text-[#292522]">₹{bom.installationCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#827B73]">
                  <span>Composite Solar GST (12% equip + 18% services):</span>
                  <span className="font-mono text-[#292522]">₹{bom.taxAmount.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-[#E8E0D6] flex justify-between text-sm font-bold text-[#172747]">
                  <span>Total Commercial Price:</span>
                  <span className="font-display text-base tabular-nums">
                    ₹{bom.totalAmount.toLocaleString()}
                  </span>
                </div>

                {bom.estimatedSubsidyAmount > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-[#2D5A43] bg-[#2D5A43]/10 p-2 rounded-lg">
                    <span>Estimated PM Surya Ghar Central Financial Assistance:</span>
                    <span className="font-mono">- ₹{bom.estimatedSubsidyAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E8E0D6] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#827B73]">
                      Net Customer Payable After Subsidy:
                    </span>
                    <p className="font-display text-lg font-bold text-[#2D5A43] tabular-nums">
                      ₹{bom.netPayableAfterSubsidy.toLocaleString()}
                    </p>
                  </div>

                  <Link to="/app/quotations">
                    <Button variant="default" size="sm" className="bg-[#172747] text-white">
                      Create Approved Quotation <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
