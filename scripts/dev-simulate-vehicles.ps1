# scripts/dev-simulate-vehicles.ps1
# Simulează 10 indicative care se mișcă continuu pe o rută mică (loop) și trimit PATCH la API.
# Rulare: pwsh ./scripts/dev-simulate-vehicles.ps1
# Opțional: pwsh ./scripts/dev-simulate-vehicles.ps1 -ApiBase "http://127.0.0.1:3001" -CityId "baia-mare" -Count 10 -StepMs 900

param(
  [string]$ApiBase = "http://localhost:3001",
  [string]$CityId = "baia-mare",
  [int]$Count = 10,
  [int]$StepMs = 900
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function New-Point([double]$Lat, [double]$Lng) {
  return [pscustomobject]@{ lat = $Lat; lng = $Lng }
}

function Invoke-VehicleLocationPatch {
  param(
    [string]$Base,
    [string]$VehicleId,
    [string]$City,
    [double]$Lat,
    [double]$Lng
  )

  $uri = "$Base/dev/vehicles/$VehicleId/location"
  $bodyObj = @{
    cityId = $City
    lat    = [double]$Lat
    lng    = [double]$Lng
  }

  $json = $bodyObj | ConvertTo-Json -Depth 5
  Invoke-RestMethod -Method Patch -Uri $uri -ContentType "application/json" -Body $json | Out-Null
}

# Baia Mare (aprox) — puncte mici în jurul centrului
$centerLat = 47.659
$centerLng = 23.584

# Rută mică (loop) — un dreptunghi/oval mic (~câteva sute de metri, aproximativ)
$route = @(
  (New-Point ($centerLat + 0.0010) ($centerLng - 0.0012))
  (New-Point ($centerLat + 0.0012) ($centerLng - 0.0002))
  (New-Point ($centerLat + 0.0007) ($centerLng + 0.0011))
  (New-Point ($centerLat - 0.0004) ($centerLng + 0.0013))
  (New-Point ($centerLat - 0.0011) ($centerLng + 0.0003))
  (New-Point ($centerLat - 0.0010) ($centerLng - 0.0010))
)

# Generează 10 vehicleIds: 01..10 (sau cât ceri)
$vehicleIds = @()
for ($i = 1; $i -le $Count; $i++) {
  $vehicleIds += ($i.ToString("00"))
}

Write-Host "[sim] API: $ApiBase | cityId: $CityId | vehicles: $Count | step: ${StepMs}ms"
Write-Host "[sim] Stop: Ctrl+C"

# Fiecare vehicul pornește de pe un offset diferit pe rută, ca să nu stea toate suprapuse
$idxByVehicle = @{}
for ($i = 0; $i -lt $vehicleIds.Count; $i++) {
  $vid = $vehicleIds[$i]
  $idxByVehicle[$vid] = ($i % $route.Count)
}

# Rulează la infinit
while ($true) {
  foreach ($vid in $vehicleIds) {
    $idx = [int]$idxByVehicle[$vid]
    $p = $route[$idx]

    # mic jitter ca să pară mai natural (foarte mic)
    $jitLat = (Get-Random -Minimum -0.00003 -Maximum 0.00003)
    $jitLng = (Get-Random -Minimum -0.00003 -Maximum 0.00003)

    $lat = [double]$p.lat + [double]$jitLat
    $lng = [double]$p.lng + [double]$jitLng

    try {
      Invoke-VehicleLocationPatch -Base $ApiBase -VehicleId $vid -City $CityId -Lat $lat -Lng $lng
    } catch {
      Write-Host "[sim] PATCH failed for $vid => $($_.Exception.Message)"
    }

    # avansează pe rută
    $idxByVehicle[$vid] = (($idx + 1) % $route.Count)
  }

  Start-Sleep -Milliseconds $StepMs
}
