import React, { useState, useEffect } from 'react';
import { useVehicles } from '../hooks/useVehicles.ts';
import { useDrivers } from '../hooks/useDrivers.ts';
import { useTrips } from '../hooks/useTrips.ts';
import { Trip } from '../store/slices/tripSlice.ts';
import { GoogleMapBoard } from '../components/shared/GoogleMapBoard.tsx';
import { 
  Navigation, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, 
  MapPin, Send, Trash2, SlidersHorizontal, Info, Play, RefreshCw 
} from 'lucide-react';

export const Dispatch: React.FC = () => {
  const { vehicles, changeVehicleStatus } = useVehicles();
  const { drivers, changeDriverStatus } = useDrivers();
  const { trips, loadTrips, dispatchNewTrip, changeTripStatus, removeTrip } = useTrips();

  useEffect(() => {
    loadTrips();
  }, []);

  // Selected vehicle & driver
  const [selectedVehicleReg, setSelectedVehicleReg] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  
  // Input fields
  const [source, setSource] = useState('Gandhinagar Depot');
  const [destination, setDestination] = useState('Ahmedabad Hub');
  const [cargoWeight, setCargoWeight] = useState(700); // 700 to trigger over capacity by default as in Mockup 3!

  // Tracking maps
  const [trackingTripId, setTrackingTripId] = useState<string | null>('TR001');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load available assets
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  // Find currently selected vehicle object for validation
  const currentSelectedVehicle = vehicles.find(v => v.regNo === selectedVehicleReg);
  const currentSelectedDriver = drivers.find(d => d.id === selectedDriverId);

  // Capacity overload validation
  const isOverCapacity = currentSelectedVehicle 
    ? cargoWeight > currentSelectedVehicle.capacityKg 
    : false;

  const excessWeight = currentSelectedVehicle 
    ? cargoWeight - currentSelectedVehicle.capacityKg 
    : 0;

  // Pre-fill selection with VAN-05 and Alex Rivera (Mockup 3 scenario)
  useEffect(() => {
    const van = vehicles.find(v => v.name === 'VAN-05');
    const alex = drivers.find(d => d.name.includes('Alex'));
    if (van) setSelectedVehicleReg(van.regNo);
    if (alex) setSelectedDriverId(alex.id);
  }, [vehicles, drivers]);

  // Handle Dispatch Mission submission
  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleReg || !selectedDriverId) return;

    if (isOverCapacity) {
      // Create a draft with status trigger
      const newTripId = 'TR00' + (trips.length + 1);
      const newTrip: Trip = {
        id: newTripId,
        vehicleName: `${currentSelectedVehicle?.name} (${currentSelectedVehicle?.regNo})`,
        vehicleRegNo: selectedVehicleReg,
        driverName: currentSelectedDriver?.name.split(' ')[0] + ' ' + currentSelectedDriver?.name.split(' ')[1]?.[0] + '.',
        driverId: selectedDriverId,
        status: 'Draft',
        eta: 'Hold (Draft)',
        etaMinutes: 0,
        source,
        destination,
        currentLocation: source,
        cargoWeightKg: cargoWeight,
        distanceKm: 85,
        fuelUsedLiters: 0,
        expenseCost: 0,
        startTime: '--',
        progressPercent: 0
      };
      dispatchNewTrip(newTrip);
      setSuccessToast(`Mission saved as DRAFT ${newTripId} due to unresolved capacity validation.`);
      setTimeout(() => setSuccessToast(null), 5000);
      return;
    }

    // Success dispatch
    const newTripId = 'TR00' + (trips.length + 1);
    const newTrip: Trip = {
      id: newTripId,
      vehicleName: `${currentSelectedVehicle?.name} (${currentSelectedVehicle?.regNo})`,
      vehicleRegNo: selectedVehicleReg,
      driverName: currentSelectedDriver?.name.split(' ')[0] + ' ' + currentSelectedDriver?.name.split(' ')[1]?.[0] + '.',
      driverId: selectedDriverId,
      status: 'On Trip',
      eta: '14:45 PM',
      etaMinutes: 45,
      source,
      destination,
      currentLocation: `${source} (Starting)`,
      cargoWeightKg: cargoWeight,
      distanceKm: 92,
      fuelUsedLiters: 12,
      expenseCost: 1500,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      progressPercent: 10
    };

    dispatchNewTrip(newTrip);
    setSuccessToast(`Trip ${newTripId} successfully dispatched! Assets updated dynamically.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
          Trips Dispatch Board
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
          Autonomous payload routing, asset safety bounds triggers, and real-time navigation overrides.
        </p>
      </div>

      {/* Success alert banner */}
      {successToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-slide-in">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Primary Dispatch Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: New Dispatch Mission Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-[#1b1c1c] dark:text-zinc-100 tracking-wide uppercase">
              New Dispatch Mission
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold">
              Input cargo details and route markers to compute capacity limits.
            </p>
          </div>

          <form onSubmit={handleDispatch} className="space-y-4">
            
            {/* Step 1: Route Details */}
            <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
              <span className="text-[10px] font-extrabold text-[#714B67] tracking-wider uppercase flex items-center gap-1">
                <span className="h-4 w-4 bg-[#714B67] text-white text-[9px] rounded-full flex items-center justify-center font-bold">1</span>
                Route Details
              </span>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                    Source Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 font-semibold focus:outline-none focus:border-[#714B67]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                    Destination Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 font-semibold focus:outline-none focus:border-[#714B67]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Asset Allocation */}
            <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
              <span className="text-[10px] font-extrabold text-[#714B67] tracking-wider uppercase flex items-center gap-1">
                <span className="h-4 w-4 bg-[#714B67] text-white text-[9px] rounded-full flex items-center justify-center font-bold">2</span>
                Asset Allocation
              </span>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Vehicle Selector */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                    Select Vehicle
                  </label>
                  <select
                    value={selectedVehicleReg}
                    onChange={(e) => setSelectedVehicleReg(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 font-bold focus:outline-none focus:border-[#714B67]"
                  >
                    <option value="">-- Choose Asset --</option>
                    {vehicles.map(v => (
                      <option key={v.regNo} value={v.regNo}>
                        {v.name} ({v.type} - Max {v.capacityKg}kg) {v.status !== 'Available' ? `[${v.status}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Selector */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                    Select Driver Pilot
                  </label>
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 font-bold focus:outline-none focus:border-[#714B67]"
                  >
                    <option value="">-- Choose Pilot --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Cargo Weight Specifications */}
            <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
              <span className="text-[10px] font-extrabold text-[#714B67] tracking-wider uppercase flex items-center gap-1">
                <span className="h-4 w-4 bg-[#714B67] text-white text-[9px] rounded-full flex items-center justify-center font-bold">3</span>
                Cargo &amp; Specifications
              </span>

              <div className="space-y-2 pt-1">
                <label className="block text-[9px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                  Cargo Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2 px-3.5 text-xs text-[#1b1c1c] dark:text-zinc-100 font-bold focus:outline-none focus:border-[#714B67]"
                  />
                  <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-500 dark:text-zinc-400">
                    kg
                  </span>
                </div>

                {/* Conflict Detection UI Banner (recreating Mockup 3 exact wording) */}
                {isOverCapacity && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 text-[11px] flex items-start gap-2 animate-fade-in mt-2.5">
                    <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block mb-0.5">Over capacity!</span>
                      Exceeds {currentSelectedVehicle?.name} capacity by {excessWeight} kg.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submission triggers */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCargoWeight(450); // Safe capacity click helper
                }}
                className="px-3.5 py-2.5 text-xs font-bold text-[#714B67] bg-purple-50 rounded-lg hover:bg-purple-100 transition-all cursor-pointer text-center"
              >
                Reset Weight to 450kg
              </button>
              
              <button
                type="submit"
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold text-white transition-all shadow-md cursor-pointer ${
                  isOverCapacity 
                    ? 'bg-[#eae8e7] dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-[#d1c3ca] dark:border-zinc-700 shadow-none hover:bg-[#d1c3ca]' 
                    : 'bg-[#714B67] hover:bg-[#5e3b56]'
                }`}
              >
                <Send className="h-4 w-4" />
                {isOverCapacity ? 'SAVE MISSION DRAFT' : 'DISPATCH CORE MISSION'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Active Missions Board & Interactive Google Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <GoogleMapBoard activeTripId={trackingTripId} trips={trips} />

          {/* Active Missions Cards List (recreating Mockup 3 right side cards) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-zinc-400 tracking-wider uppercase">
                Active Missions Board
              </span>
              <div className="flex gap-2">
                <span className="text-[9px] font-extrabold text-[#006a68] bg-[#e6fcf5] px-2 py-0.5 rounded-full uppercase border border-[#006a68]/20">
                  {trips.filter(t => t.status === 'On Trip').length} Active
                </span>
                <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase border border-amber-200">
                  {trips.filter(t => t.status === 'Draft').length} Draft Hold
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip) => {
                const isDispatched = trip.status === 'On Trip';
                const isDraft = trip.status === 'Draft';
                return (
                  <div 
                    key={trip.id} 
                    className={`rounded-xl border p-4.5 space-y-3.5 bg-white dark:bg-zinc-900 shadow-sm transition-all relative ${
                      trackingTripId === trip.id 
                        ? 'border-[#714B67] ring-1 ring-[#714B67]' 
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-400'
                    }`}
                  >
                    {/* Header bar of mission */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1b1c1c] dark:text-zinc-100 text-xs block">
                          Mission {trip.id}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold mt-0.5">
                          {trip.source} → {trip.destination}
                        </span>
                      </div>
                      
                      {isDispatched ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e6fcf5] px-2 py-0.5 text-[9px] font-bold text-[#006a68] uppercase border border-[#006a68]/20">
                          <span className="h-1 w-1 rounded-full bg-[#10b981] animate-pulse" />
                          EN ROUTE
                        </span>
                      ) : isDraft ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600 uppercase border border-red-200">
                          DRAFT HOLD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 dark:bg-zinc-900/50 px-2 py-0.5 text-[9px] font-bold text-gray-500 dark:text-zinc-400 uppercase border border-gray-200 dark:border-zinc-800">
                          {trip.status}
                        </span>
                      )}
                    </div>

                    {/* Mission Core Details */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-[#4d4847] dark:text-zinc-300">
                      <div>
                        <span className="text-gray-500 dark:text-zinc-400 block font-semibold">Asset Pool:</span>
                        {trip.vehicleName}
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-zinc-400 block font-semibold">Pilot Pilot:</span>
                        {trip.driverName}
                      </div>
                    </div>

                    {/* Capacity Warn / Progress */}
                    {isDraft ? (
                      <div className="rounded-lg bg-red-50 border border-red-100 p-2.5 text-red-800 text-[10px] space-y-1.5">
                        <div className="font-extrabold flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                          Capacity validation failed. Resolve to dispatch.
                        </div>
                        <div className="flex gap-2 font-bold pt-1 border-t border-red-200/50">
                          <button 
                            onClick={() => {
                              setSelectedVehicleReg(trip.vehicleRegNo);
                              setCargoWeight(trip.cargoWeightKg);
                              setSource(trip.source);
                              setDestination(trip.destination);
                            }}
                            className="text-red-700 hover:underline cursor-pointer uppercase"
                          >
                            [EDIT]
                          </button>
                          <button 
                            onClick={() => removeTrip(trip.id)}
                            className="text-gray-600 dark:text-zinc-400 hover:underline cursor-pointer uppercase"
                          >
                            [ABORT]
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 dark:text-zinc-400">
                          <span>Track progress:</span>
                          <span>Est Arrival: {trip.eta}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f5f3f3] dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#008f8c] rounded-full" 
                            style={{ width: `${trip.progressPercent}%` }}
                          />
                        </div>
                        
                        {/* Tracker quick toggle */}
                        <div className="flex justify-between items-center pt-1 text-[10px] font-bold">
                          <button 
                            onClick={() => setTrackingTripId(trip.id)}
                            className="text-[#714B67] hover:underline cursor-pointer uppercase flex items-center gap-1"
                          >
                            <Navigation className="h-3 w-3" />
                            TRACK LIVE
                          </button>
                          {trip.status === 'On Trip' && (
                            <button
                              onClick={() => changeTripStatus(trip.id, 'Completed')}
                              className="text-[#006a68] hover:underline cursor-pointer uppercase flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              FORCE COMPLETED
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
