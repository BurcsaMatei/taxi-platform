param(
  [Parameter(Mandatory=$false)][string]$CityId = "baia-mare",
  [Parameter(Mandatory=$false)][string]$BaseUrl = "http://localhost:3001",
  [Parameter(Mandatory=$false)][int]$Count = 10,
  [Parameter(Mandatory=$false)][int]$Seconds = 120,
  [Parameter(Mandatory=$false)][int]$IntervalMs = 800,
  [Parameter(Mandatory=$false)][double]$CenterLat = 47.659,
  [Parameter(Mandatory=$false)][double]$CenterLng = 23.584,
  [Parameter(Mandatory=$false)][double]$RadiusLat = 0.0012,
  [Parameter(Mandatory=$false)][double]$RadiusLng = 0.0018
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Format-Indicativ([int]$n) {
  if ($n -lt 100) { return ("{0:D2}" -f $n) }
  return ("{0:D3}" -f $n)
}

function Patch-VehicleLocation([string]$vehicleId, [double]$lat, [double]$lng) {
  $uri = "$BaseUrl/dev/vehicles/$vehicleId/location"
  $body = @{
    cityId = $CityId
    lat    = $lat
    lng    = $lng
  } | ConvertTo-Json -Depth 5

  Invoke-RestMethod -Method Patch -Uri $uri -ContentType "application/json" -Body $body | Out-Null
}

$endAt = (Get-Date).AddSeconds($Seconds)
$sw = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host "[fleet-sim] CityId=$CityId BaseUrl=$BaseUrl Count=$Count Seconds=$Seconds IntervalMs=$IntervalMs" -ForegroundColor Cyan

# phases per vehicle (spread evenly)
$vehicles = 1..$Count | ForEach-Object {
  [pscustomobject]@{
    id    = (Format-Indicativ $_)
    phase = (2.0 * [Math]::PI) * (($_ - 1) / [Math]::Max(1, $Count))
  }
}

while ((Get-Date) -lt $endAt) {
  $t = $sw.Elapsed.TotalSeconds

  foreach ($v in $vehicles) {
    # small circular-ish route with slight wobble so they don't overlap perfectly
    $ang = $t * 0.7 + $v.phase
    $lat = $CenterLat + ($RadiusLat * [Math]::Cos($ang)) + (0.00015 * [Math]::Sin($ang * 2.0))
    $lng = $CenterLng + ($RadiusLng * [Math]::Sin($ang)) + (0.00015 * [Math]::Cos($ang * 1.6))

    try {
      Patch-VehicleLocation -vehicleId $v.id -lat $lat -lng $lng
    } catch {
      Write-Host "[fleet-sim] PATCH failed for $($v.id): $($_.Exception.Message)" -ForegroundColor Yellow
    }
  }

  Start-Sleep -Milliseconds $IntervalMs
}

Write-Host "[fleet-sim] done" -ForegroundColor Green
