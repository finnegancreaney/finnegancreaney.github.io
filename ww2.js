// ==================================================================
// Europe 1939 — turn-based WW2 grand strategy.
//
// Session 1 MVP scope:
// - Render a simplified map of Europe + North Africa (~30 territories)
// - Colour each territory by its owning nation (Allies / Axis / Neutral)
// - Click a territory to see its name, owner, and garrison in the sidebar
// - Stubbed "End Turn" just advances the counter
//
// Session 2+ will add: unit movement, combat resolution, AI, victory check.
// ==================================================================

// ---------- Nations (factions + neutrals) ----------
const WW2_NATIONS = {
    // Axis
    germany:    { name: 'Germany',        side: 'axis',    color: '#6b7280' },
    italy:      { name: 'Italy',          side: 'axis',    color: '#8b7355' },

    // Allies
    uk:         { name: 'United Kingdom', side: 'allies',  color: '#c94a4a' },
    france:     { name: 'France',         side: 'allies',  color: '#4a6fa5' },
    poland:     { name: 'Poland',         side: 'allies',  color: '#d4a24a' },

    // USSR — starts neutral in 1939 (Molotov–Ribbentrop pact). Could flip later.
    ussr:       { name: 'Soviet Union',   side: 'neutral', color: '#a63a3a' },

    // Minor Allied / Axis-aligned
    romania:    { name: 'Romania',        side: 'neutral', color: '#b08968' },
    hungary:    { name: 'Hungary',        side: 'neutral', color: '#9c6b4a' },
    bulgaria:   { name: 'Bulgaria',       side: 'neutral', color: '#a87a5a' },
    yugoslavia: { name: 'Yugoslavia',     side: 'neutral', color: '#7a8c6b' },
    greece:     { name: 'Greece',         side: 'neutral', color: '#5b8bb5' },
    albania:    { name: 'Albania',        side: 'axis',    color: '#9b7355' }, // Italian protectorate

    // Low Countries + Scandinavia (all neutral in Sept 1939)
    netherlands:{ name: 'Netherlands',    side: 'neutral', color: '#d98c3e' },
    belgium:    { name: 'Belgium',        side: 'neutral', color: '#ccb84a' },
    luxembourg: { name: 'Luxembourg',     side: 'neutral', color: '#a8c8e0' },
    denmark:    { name: 'Denmark',        side: 'neutral', color: '#c95555' },
    norway:     { name: 'Norway',         side: 'neutral', color: '#7a9bb8' },
    sweden:     { name: 'Sweden',         side: 'neutral', color: '#4a7ba8' },
    finland:    { name: 'Finland',        side: 'neutral', color: '#7a95b5' },

    // Iberia + neutrals
    spain:      { name: 'Spain',          side: 'neutral', color: '#c4915a' },
    portugal:   { name: 'Portugal',       side: 'neutral', color: '#5b8a5b' },
    switzerland:{ name: 'Switzerland',    side: 'neutral', color: '#b0b0b0' },
    ireland:    { name: 'Ireland',        side: 'neutral', color: '#5b9b5b' },
    turkey:     { name: 'Turkey',         side: 'neutral', color: '#a65b4a' },
    iceland:    { name: 'Iceland',        side: 'neutral', color: '#a0b8c8' },
};

// ---------- Territories ----------
// Auto-generated from Natural Earth 110m public-domain country data.
// Projection: equirectangular, viewBox 0 0 1200 720. See build_ww2_map.py.
const WW2_TERRITORIES = {
    britain: {
        name: "United Kingdom", nation: "uk",
        labelAt: [315, 300],
        path: "M265.4,290.1 L254.8,286.8 L246.0,287.0 L249.0,278.5 L246.0,269.9 L257.9,269.2 L273.0,279.1 L265.4,290.1 Z M309.3,297.5 L311.4,288.2 L301.7,278.2 L284.6,275.3 L281.2,271.0 L286.3,263.9 L281.7,259.5 L274.1,267.0 L273.2,251.6 L266.1,243.4 L271.2,226.9 L282.2,213.9 L293.5,215.2 L310.5,213.8 L295.4,231.2 L309.8,229.0 L325.3,229.0 L321.6,242.1 L308.9,256.4 L323.5,257.4 L337.2,278.0 L346.9,280.6 L359.6,305.1 L376.7,308.2 L375.0,318.4 L367.8,323.1 L373.4,331.4 L360.7,339.7 L341.8,339.6 L317.8,344.0 L311.2,340.8 L301.9,348.3 L288.8,346.5 L278.9,352.6 L271.4,349.4 L292.1,332.6 L304.7,329.2 L282.6,326.5 L278.6,320.1 L293.3,315.2 L285.6,306.6 L288.3,296.1 L309.3,297.5 Z",
        units: { infantry: 1 },
    },
    ireland: {
        name: "Ireland", nation: "ireland",
        labelAt: [240, 305],
        path: "M265.4,290.1 L267.8,301.5 L257.1,315.8 L232.1,325.3 L212.1,322.9 L223.5,306.2 L216.2,289.9 L246.0,269.9 L249.0,278.5 L246.0,287.0 L254.8,286.8 L265.4,290.1 Z",
        units: { infantry: 1 },
    },
    iceland_terr: {
        name: "Iceland", nation: "iceland",
        labelAt: [80, 105],
        path: "M148.1,88.7 L144.9,99.1 L160.8,110.0 L142.4,122.2 L89.6,136.1 L31.6,128.6 L45.5,121.6 L14.8,113.7 L39.7,110.6 L39.1,105.9 L9.5,102.2 L19.1,91.8 L40.4,89.4 L62.5,100.3 L83.9,91.6 L101.7,96.1 L124.7,87.6 L148.1,88.7 Z",
        units: { infantry: 1 },
    },
    portugal: {
        name: "Portugal", nation: "portugal",
        labelAt: [240, 516],
        path: "M225.4,481.9 L230.5,477.8 L236.3,475.5 L239.8,483.3 L248.2,483.3 L250.6,481.3 L258.8,481.9 L262.7,489.9 L256.2,494.2 L256.0,506.7 L253.7,509.0 L253.2,516.6 L247.1,517.9 L252.7,527.5 L248.8,538.0 L253.7,542.8 L251.8,547.1 L246.5,553.1 L247.7,558.4 L242.0,562.6 L234.6,560.3 L227.3,562.1 L229.5,549.6 L228.1,539.7 L221.8,538.3 L218.4,532.2 L219.6,521.7 L225.2,515.9 L229.1,499.8 L228.8,493.1 L226.0,487.3 L225.4,481.9 Z",
        units: { infantry: 1 },
    },
    spain: {
        name: "Spain", nation: "spain",
        labelAt: [290, 509],
        path: "M247.7,558.4 L246.5,553.1 L251.8,547.1 L253.7,542.8 L248.8,538.0 L252.7,527.5 L247.1,517.9 L253.2,516.6 L253.7,509.0 L256.0,506.7 L256.2,494.2 L262.7,489.9 L258.8,481.9 L250.6,481.3 L248.2,483.3 L239.8,483.3 L236.3,475.5 L230.5,477.8 L225.4,481.9 L226.1,470.5 L220.3,463.6 L240.3,452.0 L257.6,454.9 L276.5,454.8 L291.6,457.5 L326.1,457.2 L331.7,463.5 L357.7,470.7 L362.8,467.3 L378.7,474.5 L395.1,472.4 L395.9,481.7 L382.5,492.4 L364.4,495.8 L363.1,501.1 L354.4,510.0 L349.0,523.0 L354.5,532.2 L346.3,539.3 L343.3,549.7 L332.6,552.9 L322.6,565.2 L291.3,565.2 L282.4,570.8 L277.0,576.9 L270.1,575.5 L264.9,570.1 L260.9,560.9 L247.7,558.4 Z",
        units: { infantry: 1 },
    },
    france: {
        name: "France", nation: "france",
        labelAt: [399, 402],
        path: "M440.3,360.6 L446.9,364.8 L467.3,367.7 L460.1,378.7 L458.4,390.1 L454.5,392.8 L448.0,391.3 L448.5,395.4 L438.2,404.4 L438.0,411.6 L444.7,409.1 L449.6,416.1 L449.0,420.7 L453.1,426.7 L448.2,431.5 L451.9,443.9 L459.5,446.0 L457.9,452.9 L445.1,461.9 L417.3,457.6 L396.7,462.8 L395.1,472.4 L378.7,474.5 L362.8,467.3 L357.7,470.7 L331.7,463.5 L326.1,457.2 L333.4,447.6 L336.1,415.8 L321.5,399.0 L311.1,390.9 L289.5,384.7 L288.1,373.1 L306.4,369.6 L330.1,373.7 L325.6,355.6 L339.0,362.4 L371.8,350.0 L376.1,336.9 L388.4,333.6 L390.5,339.3 L397.0,339.5 L413.4,353.5 L420.7,352.2 L436.2,360.9 L440.3,360.6 Z M476.4,470.0 L485.5,463.8 L487.9,477.6 L483.2,489.9 L476.8,486.7 L473.6,475.9 L476.4,470.0 Z",
        units: { infantry: 1 },
    },
    netherlands: {
        name: "Netherlands", nation: "netherlands",
        labelAt: [433, 317],
        path: "M450.4,296.3 L453.1,301.7 L449.5,316.3 L446.0,322.4 L437.5,322.4 L439.9,339.1 L432.1,335.4 L423.2,328.4 L410.1,331.7 L399.7,330.5 L407.0,326.1 L419.4,302.5 L438.7,295.8 L450.4,296.3 Z",
        units: { infantry: 1 },
    },
    belgium: {
        name: "Belgium", nation: "belgium",
        labelAt: [419, 342],
        path: "M439.9,339.1 L438.3,350.0 L434.6,350.6 L433.0,359.5 L420.7,352.2 L413.4,353.5 L397.0,339.5 L390.5,339.3 L388.4,333.6 L399.7,330.5 L410.1,331.7 L423.2,328.4 L432.1,335.4 L439.9,339.1 Z",
        units: { infantry: 1 },
    },
    luxembourg: {
        name: "Lux.", nation: "luxembourg",
        labelAt: [437, 355],
        path: "M438.3,350.0 L441.1,353.6 L440.3,360.6 L436.2,360.9 L433.0,359.5 L434.6,350.6 L438.3,350.0 Z",
        units: { infantry: 1 },
    },
    germany: {
        name: "Germany", nation: "germany",
        labelAt: [503, 335],
        path: "M552.3,291.9 L555.6,300.0 L551.6,304.3 L556.8,310.0 L560.3,318.6 L559.2,324.1 L564.9,334.3 L558.6,336.0 L554.9,334.1 L551.4,337.2 L541.2,340.3 L536.0,344.3 L525.7,347.7 L529.7,359.2 L536.9,363.1 L544.9,370.0 L539.9,377.3 L534.8,379.4 L536.8,389.8 L535.5,392.5 L531.1,389.2 L524.3,388.8 L514.3,391.6 L501.8,390.9 L499.8,395.2 L492.7,390.7 L488.4,391.6 L473.3,386.7 L470.4,390.2 L458.4,390.1 L460.1,378.7 L467.3,367.7 L446.9,364.8 L440.3,360.6 L441.1,353.6 L438.3,350.0 L439.9,339.1 L437.5,322.4 L446.0,322.4 L449.5,316.3 L453.1,301.7 L450.4,296.3 L453.2,292.9 L465.0,292.0 L467.6,295.6 L477.2,287.7 L474.0,281.7 L473.3,272.6 L484.0,274.7 L493.0,272.3 L493.3,278.5 L507.5,282.2 L507.4,287.9 L521.7,284.9 L529.7,280.5 L545.6,286.8 L552.3,291.9 Z",
        units: { infantry: 1 },
    },
    austria: {
        name: "Austria", nation: "germany",
        labelAt: [544, 389],
        path: "M592.7,382.0 L591.6,388.6 L583.6,388.6 L586.4,392.1 L581.7,402.4 L579.0,405.1 L566.6,405.5 L559.5,409.1 L527.7,403.7 L524.5,398.2 L510.6,400.9 L508.9,404.0 L493.2,401.3 L486.8,398.4 L488.9,394.4 L488.4,391.6 L492.7,390.7 L499.8,395.2 L501.8,390.9 L514.3,391.6 L524.3,388.8 L531.1,389.2 L535.5,392.5 L536.8,389.8 L534.8,379.4 L539.9,377.3 L544.9,370.0 L555.4,375.1 L563.3,368.6 L568.3,367.4 L579.2,372.3 L585.9,371.4 L592.4,374.4 L591.2,376.5 L592.7,382.0 Z",
        units: { infantry: 1 },
    },
    czechoslovakia: {
        name: "Czechoslovakia", nation: "germany",
        labelAt: [578, 356],
        path: "M564.9,334.3 L571.6,339.4 L582.2,340.8 L581.3,345.2 L589.0,348.5 L591.1,344.4 L600.8,346.2 L602.1,351.2 L612.6,352.2 L619.1,360.1 L614.9,360.1 L612.7,363.0 L609.5,363.7 L608.5,367.3 L605.8,368.1 L605.5,369.5 L600.6,371.2 L594.4,370.9 L592.4,374.4 L585.9,371.4 L579.2,372.3 L568.3,367.4 L563.3,368.6 L555.4,375.1 L544.9,370.0 L536.9,363.1 L529.7,359.2 L525.7,347.7 L536.0,344.3 L541.2,340.3 L551.4,337.2 L554.9,334.1 L558.6,336.0 L564.9,334.3 Z M671.4,366.6 L667.5,370.8 L664.7,377.2 L661.7,378.9 L646.6,374.0 L642.0,375.0 L638.7,378.8 L618.0,382.7 L616.9,385.9 L605.0,387.9 L592.7,382.0 L591.2,376.5 L594.4,370.9 L600.6,371.2 L605.5,369.5 L605.8,368.1 L608.5,367.3 L609.5,363.7 L612.7,363.0 L614.9,360.1 L619.1,360.1 L619.9,361.0 L625.7,358.9 L632.8,364.5 L641.2,361.1 L647.8,362.7 L658.0,360.5 L671.4,366.6 Z",
        units: { infantry: 1 },
    },
    switzerland: {
        name: "Switzerland", nation: "switzerland",
        labelAt: [470, 403],
        path: "M488.4,391.6 L488.9,394.4 L486.8,398.4 L493.2,401.3 L500.4,401.7 L499.2,408.3 L493.0,411.0 L482.6,409.0 L479.5,415.4 L472.8,415.9 L470.4,413.4 L462.4,418.8 L455.6,419.6 L449.6,416.1 L444.7,409.1 L438.0,411.6 L438.2,404.4 L448.5,395.4 L448.0,391.3 L454.5,392.8 L458.4,390.1 L470.4,390.2 L473.3,386.7 L488.4,391.6 Z",
        units: { infantry: 1 },
    },
    poland: {
        name: "Poland", nation: "poland",
        labelAt: [628, 324],
        path: "M684.5,289.4 L685.1,296.5 L689.0,302.6 L688.9,308.9 L680.5,312.2 L684.8,319.6 L685.1,326.7 L692.2,340.7 L690.7,345.2 L683.7,347.1 L670.8,360.4 L674.5,367.6 L658.0,360.5 L647.8,362.7 L641.2,361.1 L632.8,364.5 L625.7,358.9 L619.9,361.0 L612.6,352.2 L602.1,351.2 L600.8,346.2 L591.1,344.4 L589.0,348.5 L581.3,345.2 L582.2,340.8 L571.6,339.4 L564.9,334.3 L559.2,324.1 L560.3,318.6 L556.8,310.0 L551.6,304.3 L555.6,300.0 L552.3,291.9 L561.9,287.2 L601.7,274.4 L615.8,277.1 L616.9,281.0 L647.9,283.0 L673.9,282.8 L681.1,284.5 L684.5,289.4 Z",
        units: { infantry: 1 },
    },
    denmark: {
        name: "Denmark", nation: "denmark",
        labelAt: [490, 252],
        path: "M493.0,272.3 L484.0,274.7 L473.3,272.6 L467.6,263.7 L467.2,247.4 L473.6,238.2 L486.0,237.2 L490.9,232.8 L502.3,228.3 L501.8,236.5 L497.6,241.8 L499.3,246.2 L507.0,248.7 L503.5,254.7 L499.3,253.0 L489.2,264.5 L493.0,272.3 Z M527.6,254.2 L532.1,262.2 L523.6,275.2 L508.9,266.2 L506.9,259.5 L527.6,254.2 Z",
        units: { infantry: 1 },
    },
    norway: {
        name: "Norway", nation: "norway",
        labelAt: [611, 93],
        path: "M792.0,39.1 L768.0,45.5 L756.6,47.0 L762.6,35.7 L744.5,29.4 L722.5,34.8 L715.6,46.5 L702.2,53.6 L687.0,49.7 L668.6,50.5 L652.9,42.1 L644.4,46.3 L635.7,47.0 L633.6,57.5 L607.0,54.9 L603.2,63.8 L589.7,63.8 L566.2,92.9 L544.3,115.4 L549.5,120.9 L544.5,127.2 L530.5,126.9 L521.4,141.9 L522.2,163.2 L531.3,171.3 L526.6,190.1 L514.8,201.1 L508.6,210.3 L499.2,200.5 L471.3,219.0 L452.5,222.7 L432.9,214.6 L427.9,197.4 L423.4,160.5 L436.4,150.2 L473.7,136.7 L501.6,120.2 L561.3,67.0 L623.8,34.9 L654.8,27.9 L678.0,28.8 L699.5,15.5 L725.2,16.2 L750.6,13.0 L794.7,24.7 L776.5,29.0 L792.0,39.1 Z",
        units: { infantry: 1 },
    },
    sweden: {
        name: "Sweden", nation: "sweden",
        labelAt: [584, 153],
        path: "M508.6,210.3 L514.8,201.1 L526.6,190.1 L531.3,171.3 L522.2,163.2 L521.4,141.9 L530.5,126.9 L544.5,127.2 L549.5,120.9 L544.3,115.4 L566.2,92.9 L589.7,63.8 L603.2,63.8 L607.0,54.9 L633.6,57.5 L635.7,47.0 L644.4,46.3 L685.3,65.0 L685.6,89.7 L690.4,95.9 L666.1,100.4 L652.4,111.6 L654.6,121.4 L604.9,148.0 L594.6,170.5 L604.7,181.8 L618.2,190.7 L605.2,208.7 L590.5,212.5 L585.1,239.3 L577.1,254.3 L560.0,252.8 L552.0,265.5 L535.7,266.2 L531.2,251.1 L519.4,232.9 L508.6,210.3 Z",
        units: { infantry: 1 },
    },
    finland: {
        name: "Finland", nation: "finland",
        labelAt: [717, 104],
        path: "M756.6,47.0 L754.5,58.2 L776.2,68.8 L763.1,80.9 L779.5,99.1 L770.0,112.8 L782.7,124.7 L777.0,135.2 L797.9,146.1 L792.6,154.3 L749.2,183.9 L723.6,185.2 L698.8,191.1 L675.8,194.5 L667.6,185.7 L654.0,180.5 L657.1,164.7 L650.2,150.3 L657.0,141.0 L669.8,130.9 L702.1,113.6 L711.5,110.2 L710.0,103.5 L690.4,95.9 L685.6,89.7 L685.3,65.0 L644.4,46.3 L652.9,42.1 L668.6,50.5 L687.0,49.7 L702.2,53.6 L715.6,46.5 L722.5,34.8 L744.5,29.4 L762.6,35.7 L756.6,47.0 Z",
        units: { infantry: 1 },
    },
    hungary: {
        name: "Hungary", nation: "hungary",
        labelAt: [625, 392],
        path: "M664.7,377.2 L672.6,381.6 L673.6,385.9 L664.9,389.2 L649.7,410.9 L638.4,414.0 L629.6,413.3 L613.5,419.8 L601.8,416.8 L586.8,407.9 L584.1,402.5 L581.7,402.4 L586.4,392.1 L583.6,388.6 L591.6,388.6 L592.7,382.0 L605.0,387.9 L616.9,385.9 L618.0,382.7 L638.7,378.8 L642.0,375.0 L646.6,374.0 L661.7,378.9 L664.7,377.2 Z",
        units: { infantry: 1 },
    },
    romania: {
        name: "Romania", nation: "romania",
        labelAt: [710, 420],
        path: "M751.5,424.2 L757.8,427.1 L764.5,424.6 L770.9,427.3 L771.2,431.4 L764.4,434.9 L760.1,433.4 L756.1,452.7 L747.8,451.0 L737.5,445.2 L720.9,448.9 L713.9,453.0 L693.2,452.1 L682.3,449.6 L676.9,450.8 L670.2,441.5 L673.5,438.8 L670.0,436.8 L665.6,440.3 L657.3,435.7 L656.2,429.1 L647.6,425.3 L646.1,420.2 L638.4,414.0 L649.7,410.9 L664.9,389.2 L679.7,382.5 L688.4,384.2 L697.4,384.3 L704.0,388.2 L708.8,385.7 L719.2,384.2 L722.8,380.5 L728.7,380.5 L733.0,382.0 L750.0,403.0 L750.5,410.1 L749.0,416.9 L751.5,424.2 Z",
        units: { infantry: 1 },
    },
    bulgaria: {
        name: "Bulgaria", nation: "bulgaria",
        labelAt: [701, 466],
        path: "M672.8,444.2 L676.9,450.8 L682.3,449.6 L693.2,452.1 L713.9,453.0 L720.9,448.9 L737.5,445.2 L747.8,451.0 L756.1,452.7 L748.8,459.3 L743.6,470.8 L748.2,479.9 L736.0,477.7 L721.7,482.8 L721.5,490.7 L708.7,492.2 L698.7,486.7 L687.4,491.1 L677.0,490.6 L676.0,480.0 L668.9,474.9 L671.2,472.6 L669.7,470.7 L672.1,465.6 L677.4,460.6 L670.6,453.7 L669.3,447.9 L672.8,444.2 Z",
        units: { infantry: 1 },
    },
    yugoslavia: {
        name: "Yugoslavia", nation: "yugoslavia",
        labelAt: [648, 448],
        path: "M618.8,417.5 L629.6,413.3 L638.4,414.0 L646.1,420.2 L647.6,425.3 L656.2,429.1 L657.3,435.7 L665.6,440.3 L670.0,436.8 L673.5,438.8 L670.2,441.5 L672.8,444.2 L669.3,447.9 L670.6,453.7 L677.4,460.6 L672.1,465.6 L669.7,470.7 L671.2,472.6 L668.9,474.9 L657.6,476.1 L657.1,474.9 L660.4,469.1 L658.3,469.2 L646.8,459.6 L644.3,460.5 L642.3,465.8 L638.9,467.0 L640.1,465.6 L630.1,460.6 L624.3,455.6 L627.6,454.9 L629.6,447.4 L622.8,441.2 L626.4,434.2 L621.3,434.2 L626.7,428.2 L622.2,423.7 L618.8,417.5 Z M586.8,407.9 L601.8,416.8 L613.5,419.8 L618.8,417.5 L622.2,423.7 L626.7,428.2 L621.3,434.2 L614.9,430.7 L605.1,430.9 L593.0,428.3 L586.4,428.6 L583.3,431.9 L578.2,428.3 L575.3,434.9 L585.3,447.3 L597.1,456.9 L602.5,463.5 L615.0,469.6 L613.4,472.3 L600.1,466.4 L592.0,460.6 L579.0,455.9 L567.2,444.1 L570.0,442.9 L563.6,436.2 L563.3,430.8 L554.2,428.3 L549.9,435.2 L545.7,429.8 L546.6,424.0 L556.4,424.5 L559.0,421.8 L563.8,424.5 L569.3,424.8 L569.3,420.3 L574.2,418.7 L575.6,412.2 L586.8,407.9 Z M547.9,407.9 L559.5,409.1 L566.6,405.5 L579.0,405.1 L581.7,402.4 L584.1,402.5 L586.8,407.9 L575.6,412.2 L574.2,418.7 L569.3,420.3 L569.3,424.8 L563.8,424.5 L559.0,421.8 L556.4,424.5 L546.6,424.0 L549.7,422.5 L546.3,415.7 L547.9,407.9 Z M615.0,469.6 L602.5,463.5 L597.1,456.9 L585.3,447.3 L575.3,434.9 L578.2,428.3 L583.3,431.9 L586.4,428.6 L593.0,428.3 L605.1,430.9 L614.9,430.7 L621.3,434.2 L626.4,434.2 L622.8,441.2 L629.6,447.4 L627.6,454.9 L621.6,457.1 L617.0,460.8 L615.0,469.6 Z M636.3,470.6 L632.5,472.0 L631.6,469.0 L625.5,476.9 L626.4,482.0 L623.5,480.7 L619.5,475.5 L613.4,472.3 L617.0,460.8 L624.3,455.6 L630.1,460.6 L640.1,465.6 L636.3,470.6 Z M668.9,474.9 L676.0,480.0 L677.0,490.6 L674.3,491.1 L672.0,493.9 L664.3,493.6 L658.9,497.1 L649.7,498.5 L643.8,494.6 L641.8,487.8 L643.6,482.3 L645.4,482.4 L646.1,479.2 L662.4,475.1 L668.9,474.9 Z M643.6,482.3 L642.7,476.5 L639.3,474.9 L636.3,470.6 L638.9,467.0 L642.3,465.8 L644.3,460.5 L646.8,459.6 L658.3,469.2 L660.4,469.1 L657.1,474.9 L657.6,476.1 L646.1,479.2 L645.4,482.4 L643.6,482.3 Z",
        units: { infantry: 1 },
    },
    albania: {
        name: "Albania", nation: "albania",
        labelAt: [637, 492],
        path: "M649.7,498.5 L649.4,502.7 L644.8,505.0 L644.0,510.2 L637.4,518.0 L635.0,516.9 L634.7,513.4 L626.9,508.0 L625.7,500.4 L626.9,489.4 L628.8,484.5 L626.4,482.0 L625.5,476.9 L631.6,469.0 L632.5,472.0 L636.3,470.6 L639.3,474.9 L642.7,476.5 L643.6,482.3 L641.8,487.8 L643.8,494.6 L649.7,498.5 Z",
        units: { infantry: 1 },
    },
    greece: {
        name: "Greece", nation: "greece",
        labelAt: [707, 588],
        path: "M724.1,587.2 L722.3,591.9 L702.0,593.3 L702.1,590.6 L684.9,587.5 L687.5,580.7 L695.2,586.1 L706.2,585.2 L716.7,586.3 L716.4,589.1 L724.1,587.2 Z M677.0,490.6 L687.4,491.1 L698.7,486.7 L708.7,492.2 L721.5,490.7 L721.7,482.8 L728.5,487.0 L724.2,497.0 L720.8,498.8 L704.8,496.8 L687.7,501.0 L697.5,510.0 L690.4,512.6 L682.5,512.6 L675.0,504.4 L672.4,507.9 L675.5,517.5 L682.6,525.0 L677.3,528.5 L692.1,540.5 L692.3,549.5 L679.3,545.3 L683.4,553.4 L674.5,555.1 L679.8,569.2 L670.4,569.4 L658.9,562.5 L653.6,549.7 L651.1,539.0 L638.4,522.6 L637.4,518.0 L644.0,510.2 L644.8,505.0 L649.4,502.7 L649.7,498.5 L658.9,497.1 L664.3,493.6 L672.0,493.9 L674.3,491.1 L677.0,490.6 Z",
        units: { infantry: 1 },
    },
    turkey: {
        name: "Turkey", nation: "turkey",
        labelAt: [872, 537],
        path: "M985.0,557.3 L978.3,560.0 L973.3,555.9 L956.9,553.8 L950.8,556.3 L934.8,558.8 L927.2,558.5 L910.9,564.5 L899.3,564.6 L891.8,561.6 L876.2,566.0 L871.6,562.9 L870.9,571.8 L863.3,578.9 L858.1,571.6 L863.4,565.6 L854.8,567.0 L843.0,563.3 L833.3,572.5 L811.9,574.3 L800.5,565.7 L785.2,565.2 L782.0,571.8 L772.2,573.7 L758.6,565.2 L743.2,565.5 L734.8,549.5 L724.5,540.7 L731.4,528.2 L722.4,520.6 L738.1,505.3 L759.8,504.6 L765.7,492.5 L792.6,494.6 L809.6,484.2 L826.1,479.7 L849.4,479.4 L874.1,490.6 L894.3,496.8 L910.8,494.4 L922.9,495.8 L939.6,487.4 L954.6,486.7 L968.2,494.5 L970.6,500.2 L969.3,507.9 L979.8,511.9 L985.3,516.6 L975.7,521.1 L980.1,539.5 L977.3,544.5 L985.0,557.3 Z M721.7,482.8 L736.0,477.7 L748.2,479.9 L749.9,486.0 L762.2,491.2 L759.6,495.1 L742.9,496.0 L725.1,509.6 L720.6,502.1 L720.8,498.8 L724.2,497.0 L728.5,487.0 L721.7,482.8 Z",
        units: { infantry: 1 },
    },
    italy: {
        name: "Italy", nation: "italy",
        labelAt: [530, 461],
        path: "M500.4,401.7 L508.9,404.0 L510.6,400.9 L524.5,398.2 L527.7,403.7 L547.9,407.9 L546.3,415.7 L549.7,422.5 L538.5,420.2 L527.0,425.9 L527.8,433.8 L526.0,438.4 L530.7,446.5 L543.9,454.6 L551.0,467.8 L566.7,480.7 L577.8,480.6 L581.2,484.2 L577.3,487.3 L600.3,498.0 L612.4,506.3 L613.8,509.3 L611.2,515.0 L603.4,507.6 L591.1,504.9 L585.2,515.3 L595.4,521.2 L593.7,529.6 L587.8,530.5 L580.2,544.2 L574.4,545.5 L574.4,540.6 L577.3,532.0 L580.4,528.6 L570.5,511.2 L564.7,509.2 L560.5,502.3 L551.4,499.4 L545.3,493.0 L534.9,492.0 L510.9,474.3 L501.3,465.1 L496.9,449.3 L478.4,442.1 L471.9,444.3 L463.8,451.7 L457.9,452.9 L459.5,446.0 L451.9,443.9 L448.2,431.5 L453.1,426.7 L449.0,420.7 L449.6,416.1 L455.6,419.6 L462.4,418.8 L470.4,413.4 L472.8,415.9 L479.5,415.4 L482.6,409.0 L493.0,411.0 L499.2,408.3 L500.4,401.7 Z M561.3,541.7 L572.1,540.3 L567.0,552.9 L569.1,557.9 L566.1,566.1 L555.3,560.1 L548.1,558.3 L528.4,550.2 L530.4,542.0 L546.9,543.4 L561.3,541.7 Z M475.9,497.6 L483.0,492.6 L491.4,504.0 L489.5,525.2 L483.0,524.2 L477.3,529.5 L471.9,525.3 L471.4,505.9 L468.1,496.8 L475.9,497.6 Z",
        units: { infantry: 1 },
    },
    morocco: {
        name: "Morocco", nation: "france",
        labelAt: [221, 692],
        path: "M322.3,589.3 L327.6,599.6 L328.5,609.3 L333.3,626.2 L337.1,629.6 L334.5,635.8 L316.0,638.5 L309.6,644.4 L301.4,645.8 L300.8,657.6 L284.3,664.0 L278.9,672.0 L267.4,676.3 L253.3,678.7 L230.5,690.5 L230.6,709.5 L228.5,709.5 L228.8,718.1 L220.1,718.6 L215.5,722.2 L209.1,722.2 L204.0,720.1 L192.1,721.9 L187.5,734.3 L183.1,735.5 L176.5,755.7 L156.8,772.9 L152.2,795.0 L146.4,802.2 L144.7,808.0 L112.7,809.2 L113.3,801.8 L118.7,797.5 L123.4,789.1 L122.5,783.7 L127.3,772.4 L135.2,762.3 L139.9,759.7 L143.7,750.3 L144.0,741.8 L149.1,731.9 L158.5,726.1 L167.4,709.8 L174.8,703.4 L187.9,701.6 L199.0,690.7 L206.1,686.4 L217.9,673.1 L214.4,653.2 L219.7,639.4 L221.6,631.0 L230.7,620.2 L255.4,606.2 L269.2,579.8 L279.6,579.9 L288.1,586.7 L301.6,585.6 L316.2,589.1 L322.3,589.3 Z",
        units: { infantry: 1 },
    },
    algeria: {
        name: "Algeria", nation: "france",
        labelAt: [405, 672],
        path: "M230.3,713.7 L230.5,690.5 L253.3,678.7 L267.4,676.3 L278.9,672.0 L284.3,664.0 L300.8,657.6 L301.4,645.8 L309.6,644.4 L316.0,638.5 L334.5,635.8 L337.1,629.6 L333.3,626.2 L328.5,609.3 L327.6,599.6 L322.3,589.3 L335.9,580.6 L351.1,577.8 L360.1,571.2 L373.7,566.3 L420.9,562.2 L428.0,564.5 L441.3,558.2 L456.4,558.1 L462.2,561.8 L471.8,560.9 L469.0,569.1 L471.2,584.3 L467.9,597.5 L459.2,606.4 L460.4,618.5 L472.0,628.0 L472.1,631.9 L480.8,638.4 L486.8,667.1 L491.4,681.2 L492.1,688.6 L489.7,701.7 L490.7,709.0 L488.9,717.7 L490.1,727.8 L484.5,734.5 L492.9,746.2 L493.4,753.0 L498.4,761.9 L505.0,759.0 L516.2,766.4 L522.3,776.5 L474.0,806.9 L433.1,838.4 L413.2,845.5 L397.5,847.1 L397.4,836.9 L382.0,829.7 L378.7,822.2 L230.3,713.7 Z",
        units: { infantry: 1 },
    },
    tunisia: {
        name: "Tunisia", nation: "france",
        labelAt: [492, 608],
        path: "M486.8,667.1 L480.8,638.4 L472.1,631.9 L472.0,628.0 L460.4,618.5 L459.2,606.4 L467.9,597.5 L471.2,584.3 L469.0,569.1 L471.8,560.9 L487.2,554.4 L497.1,556.3 L496.7,564.4 L508.6,558.5 L509.6,561.6 L502.6,569.4 L502.5,576.8 L507.4,580.8 L505.5,594.7 L496.2,602.7 L498.9,611.4 L506.2,611.7 L509.8,619.3 L515.1,621.8 L514.3,634.1 L507.5,638.7 L503.1,643.8 L493.4,650.0 L494.9,656.6 L493.7,663.4 L486.8,667.1 Z",
        units: { infantry: 1 },
    },
    libya: {
        name: "Libya", nation: "italy",
        labelAt: [585, 692],
        path: "M705.9,800.0 L705.9,832.0 L689.6,832.0 L689.5,838.7 L576.9,777.4 L552.6,792.1 L544.7,783.4 L522.3,776.5 L516.2,766.4 L505.0,759.0 L498.4,761.9 L493.4,753.0 L492.9,746.2 L484.5,734.5 L490.1,727.8 L488.9,717.7 L490.7,709.0 L489.7,701.7 L492.1,688.6 L491.4,681.2 L486.8,667.1 L493.7,663.4 L494.9,656.6 L493.4,650.0 L503.1,643.8 L507.5,638.7 L514.3,634.1 L515.1,621.8 L531.7,627.3 L537.6,625.9 L549.4,628.6 L568.2,635.8 L574.8,650.0 L607.4,659.8 L622.4,667.7 L629.3,663.6 L636.0,656.2 L632.8,644.0 L637.2,636.2 L647.4,628.7 L657.1,626.5 L676.2,629.8 L681.0,636.9 L686.2,637.0 L690.7,639.7 L704.8,641.6 L708.2,646.9 L703.1,654.6 L705.3,661.4 L701.6,671.3 L705.9,684.2 L705.9,800.0 Z",
        units: { infantry: 1 },
    },
    egypt: {
        name: "Egypt", nation: "uk",
        labelAt: [801, 695],
        path: "M873.4,800.0 L705.9,800.0 L705.9,684.2 L701.6,671.3 L705.3,661.4 L703.1,654.6 L708.2,646.9 L727.0,646.6 L761.1,658.1 L772.0,653.0 L777.8,648.4 L790.3,647.1 L800.3,649.1 L804.1,657.1 L807.4,651.8 L818.7,655.6 L829.7,656.5 L836.7,652.5 L846.0,680.0 L842.0,686.4 L839.0,698.5 L835.1,706.8 L831.8,709.6 L820.8,697.3 L810.7,674.4 L809.2,675.8 L815.1,692.7 L823.7,708.8 L834.4,733.7 L844.2,751.5 L856.8,769.2 L854.0,772.0 L854.5,782.4 L873.4,800.0 Z",
        units: { infantry: 1 },
    },
    ussr_leningrad: {
        name: "Leningrad", nation: "ussr",
        labelAt: [917, 96],
        path: "M743.3,224.0 L740.0,212.4 L750.1,203.2 L748.0,200.4 L764.0,191.6 L749.2,183.9 L792.6,154.3 L797.9,146.1 L777.0,135.2 L782.7,124.7 L770.0,112.8 L779.5,99.1 L763.1,80.9 L776.2,68.8 L754.5,58.2 L756.6,47.0 L768.0,45.5 L792.0,39.1 L806.6,33.5 L829.8,43.2 L868.4,47.0 L921.8,65.1 L932.6,72.7 L933.5,83.3 L917.9,91.7 L894.8,96.0 L831.8,83.8 L821.4,85.9 L844.4,97.6 L846.3,121.4 L875.5,130.4 L877.3,122.6 L868.8,115.8 L877.8,109.7 L911.9,119.7 L923.8,115.8 L914.3,104.1 L947.2,88.4 L960.2,89.3 L973.4,94.9 L981.6,83.9 L969.9,74.4 L976.8,64.8 L966.4,54.9 L1005.9,60.0 L1013.9,69.0 L996.1,70.9 L996.2,79.8 L1007.3,85.3 L1029.1,81.8 L1032.5,71.6 L1111.3,50.3 L1122.0,51.1 L1108.0,60.8 L1125.5,62.4 L1135.7,57.0 L1162.1,56.5 L1183.1,49.9 L1199.2,59.5 L1200.0,59.0 L1200.0,224.0 Z M1136.6,0.0 L1138.2,7.4 L1165.2,20.5 L1156.9,21.9 L1110.7,19.8 L1107.0,12.7 L1081.4,8.4 L1079.4,0.0 Z",
        units: { infantry: 1 },
    },
    ussr_moscow: {
        name: "Moscow", nation: "ussr",
        labelAt: [886, 304],
        path: "M888.0,352.0 L880.8,345.9 L870.0,348.4 L852.1,342.8 L852.4,339.6 L847.4,332.7 L836.1,331.9 L834.9,326.9 L838.5,323.7 L829.4,314.6 L814.8,316.2 L810.5,315.4 L807.0,319.0 L801.7,318.4 L798.2,308.1 L794.9,302.8 L797.6,301.3 L809.0,301.9 L814.5,298.4 L810.4,294.1 L800.9,291.3 L801.8,288.4 L796.0,285.5 L787.2,275.0 L790.2,270.7 L788.8,263.2 L775.0,259.4 L767.6,261.3 L765.6,257.3 L750.7,253.3 L746.2,243.9 L745.0,236.1 L738.2,232.4 L744.2,227.3 L743.3,224.0 L1200.0,224.0 L1200.0,338.6 L1194.9,343.3 L1176.9,335.0 L1154.5,335.3 L1139.5,342.1 L1091.7,324.5 L1069.6,324.9 L1040.5,342.3 L1039.0,352.0 L1035.6,352.0 L1024.2,344.7 L1019.6,352.0 Z M673.9,282.8 L647.9,283.0 L630.5,281.2 L633.7,274.1 L653.2,269.0 L668.0,271.8 L674.2,274.3 L672.7,278.7 Z",
        units: { infantry: 1 },
    },
    ussr_ukraine: {
        name: "Ukraine", nation: "ussr",
        labelAt: [783, 372],
        path: "M801.7,318.4 L807.0,319.0 L810.5,315.4 L814.8,316.2 L829.4,314.6 L838.5,323.7 L834.9,326.9 L836.1,331.9 L847.4,332.7 L852.4,339.6 L852.1,342.8 L870.0,348.4 L880.8,345.9 L889.6,353.3 L897.8,353.2 L918.6,358.4 L918.8,363.1 L913.1,371.5 L916.2,380.3 L914.0,385.6 L900.3,386.8 L893.0,391.3 L892.6,398.4 L881.3,399.6 L871.9,404.8 L858.7,405.7 L846.5,411.6 L847.2,420.2 L845.1,419.7 L843.3,416.5 L828.7,412.5 L825.0,416.4 L823.0,414.7 L801.1,410.7 L800.1,404.7 L787.0,406.7 L781.8,415.5 L770.9,427.3 L764.5,424.6 L757.8,427.1 L751.5,424.2 L755.1,422.4 L761.4,411.9 L760.4,409.0 L763.4,407.7 L764.8,409.9 L773.1,410.4 L776.8,409.2 L774.2,407.6 L775.2,405.2 L770.3,401.1 L768.2,394.5 L763.1,391.8 L764.1,386.4 L757.7,382.1 L751.9,381.5 L741.5,376.5 L732.1,378.1 L728.7,380.5 L722.8,380.5 L719.2,384.2 L708.8,385.7 L704.0,388.2 L697.4,384.3 L688.4,384.2 L679.7,382.5 L673.6,385.9 L672.6,381.6 L664.7,377.2 L667.5,370.8 L671.4,366.6 L674.5,367.6 L670.8,360.4 L683.7,347.1 L690.7,345.2 L692.2,340.7 L685.1,326.7 L691.8,326.1 L699.6,321.8 L710.5,321.4 L724.8,322.7 L740.5,326.5 L751.6,326.8 L757.0,329.2 L762.3,326.4 L766.0,330.1 L778.7,329.3 L784.3,330.9 L785.2,322.8 L789.6,319.3 L801.7,318.4 Z M750.7,253.3 L765.6,257.3 L767.6,261.3 L775.0,259.4 L788.8,263.2 L790.2,270.7 L787.2,275.0 L796.0,285.5 L801.8,288.4 L800.9,291.3 L810.4,294.1 L814.5,298.4 L809.0,301.9 L797.6,301.3 L794.9,302.8 L798.2,308.1 L801.7,318.4 L789.6,319.3 L785.2,322.8 L784.3,330.9 L778.7,329.3 L766.0,330.1 L762.3,326.4 L757.0,329.2 L751.6,326.8 L740.5,326.5 L724.8,322.7 L710.5,321.4 L699.6,321.8 L691.8,326.1 L685.1,326.7 L684.8,319.6 L680.5,312.2 L688.9,308.9 L689.0,302.6 L685.1,296.5 L684.5,289.4 L698.1,289.5 L713.5,283.5 L716.7,274.4 L728.3,269.3 L727.0,262.2 L750.7,253.3 Z M917.6,352.0 L917.6,448.0 L905.0,448.0 L899.0,443.5 L882.9,437.5 L870.7,428.1 L881.0,425.5 L892.7,412.1 L884.8,405.8 L905.6,399.3 L905.2,395.8 L892.6,398.4 L893.0,391.3 L900.3,386.8 L914.0,385.6 L916.2,380.3 L913.1,371.5 L917.6,364.7 L917.6,358.1 L897.8,353.2 L889.6,353.3 L888.0,352.0 Z M825.0,416.4 L828.7,412.5 L843.3,416.5 L847.4,421.6 L854.3,425.4 L868.7,424.5 L865.9,430.2 L850.4,433.0 L831.3,442.2 L823.4,439.0 L826.5,431.4 L811.1,426.8 L813.6,423.7 L827.1,418.4 Z",
        units: { infantry: 1 },
    },
    ussr_caucasus: {
        name: "Caucasus", nation: "ussr",
        labelAt: [968, 433],
        path: "M1046.1,409.6 L1039.7,419.1 L1026.0,421.7 L1012.0,438.3 L1024.8,453.4 L1023.4,464.2 L1038.8,483.1 L1030.4,489.5 L1028.0,493.6 L1021.7,492.5 L1012.0,482.8 L999.2,478.5 L994.9,472.0 L981.7,468.6 L973.1,471.1 L970.7,468.1 L951.5,460.5 L918.7,455.2 L917.0,457.0 L899.0,443.5 L889.4,439.9 L889.4,415.9 L892.7,412.1 L889.4,409.5 L889.4,404.4 L905.6,399.3 L905.2,395.8 L892.6,398.4 L893.0,391.3 L900.3,386.8 L914.0,385.6 L914.6,384.0 L1015.9,384.0 L1020.9,388.5 L1031.4,388.1 L1040.4,398.8 L1039.0,407.0 Z M917.0,457.0 L918.7,455.2 L951.5,460.5 L970.7,468.1 L973.1,471.1 L981.7,468.6 L994.9,472.0 L999.2,478.5 L1008.1,482.2 L1004.4,484.4 L1011.4,493.1 L1009.4,495.0 L1001.8,494.0 L991.3,489.4 L987.8,492.0 L968.2,494.5 L954.6,486.7 L939.6,487.4 L941.7,480.6 L938.2,469.7 L930.0,463.8 L922.2,461.9 L917.0,457.0 Z M1009.5,531.7 L1004.4,532.1 L998.6,522.9 L998.7,520.4 L992.4,520.5 L988.3,516.2 L985.3,516.6 L979.8,511.9 L969.3,507.9 L970.6,500.2 L968.2,494.5 L987.8,492.0 L990.8,496.2 L996.1,499.0 L993.3,503.0 L1000.8,508.5 L996.8,513.6 L1002.8,518.0 L1009.2,520.6 L1009.5,531.7 Z M1008.1,482.2 L1012.0,482.8 L1021.7,492.5 L1028.0,493.6 L1030.4,489.5 L1038.8,483.1 L1046.3,491.5 L1053.4,502.8 L1060.0,503.6 L1064.4,507.9 L1052.7,509.2 L1050.3,521.6 L1047.9,527.2 L1042.7,531.0 L1043.1,538.9 L1039.5,539.7 L1030.7,531.3 L1035.6,523.4 L1031.4,518.7 L1026.1,519.9 L1009.5,531.7 L1009.2,520.6 L1002.8,518.0 L996.8,513.6 L1000.8,508.5 L993.3,503.0 L996.1,499.0 L990.8,496.2 L987.8,492.0 L991.3,489.4 L1001.8,494.0 L1009.4,495.0 L1011.4,493.1 L1004.4,484.4 L1008.1,482.2 Z M1004.4,532.1 L994.7,530.0 L987.6,522.6 L985.3,516.6 L988.3,516.2 L992.4,520.5 L998.7,520.4 L998.6,522.9 L1004.4,532.1 Z",
        units: { infantry: 1 },
    },
};

// ---------- Adjacency (undirected) ----------
// Sea crossings included (Channel, North Sea, Mediterranean).
const WW2_ADJACENCY_RAW = [
    // British Isles
    ['britain', 'ireland'], ['britain', 'iceland_terr'],
    ['britain', 'france'], ['britain', 'netherlands'], ['britain', 'norway'],
    ['britain', 'egypt'],  // naval supply to N. Africa
    ['iceland_terr', 'norway'],

    // Iberia
    ['portugal', 'spain'], ['spain', 'france'], ['spain', 'morocco'],

    // France + Low Countries
    ['france', 'belgium'], ['france', 'luxembourg'], ['france', 'germany'],
    ['france', 'switzerland'], ['france', 'italy'],
    ['france', 'morocco'], ['france', 'algeria'], ['france', 'tunisia'],
    ['netherlands', 'belgium'], ['netherlands', 'germany'],
    ['belgium', 'luxembourg'], ['belgium', 'germany'],
    ['luxembourg', 'germany'],

    // Central Europe
    ['germany', 'denmark'], ['germany', 'poland'],
    ['germany', 'czechoslovakia'], ['germany', 'austria'], ['germany', 'switzerland'],
    ['austria', 'czechoslovakia'], ['austria', 'switzerland'],
    ['austria', 'italy'], ['austria', 'hungary'], ['austria', 'yugoslavia'],
    ['czechoslovakia', 'poland'], ['czechoslovakia', 'hungary'],
    ['switzerland', 'italy'],

    // Scandinavia
    ['denmark', 'norway'], ['denmark', 'sweden'],
    ['norway', 'sweden'], ['norway', 'finland'],
    ['sweden', 'finland'], ['finland', 'ussr_leningrad'],

    // Poland + USSR western front
    ['poland', 'ussr_leningrad'], ['poland', 'ussr_ukraine'],
    ['poland', 'romania'], ['poland', 'hungary'],

    // USSR internal
    ['ussr_leningrad', 'ussr_moscow'], ['ussr_leningrad', 'ussr_ukraine'],
    ['ussr_moscow', 'ussr_ukraine'], ['ussr_moscow', 'ussr_caucasus'],
    ['ussr_ukraine', 'ussr_caucasus'], ['ussr_ukraine', 'romania'],
    ['ussr_caucasus', 'turkey'],

    // Balkans
    ['hungary', 'romania'], ['hungary', 'yugoslavia'],
    ['romania', 'bulgaria'], ['romania', 'yugoslavia'],
    ['bulgaria', 'yugoslavia'], ['bulgaria', 'greece'], ['bulgaria', 'turkey'],
    ['yugoslavia', 'albania'], ['yugoslavia', 'italy'], ['yugoslavia', 'greece'],
    ['albania', 'greece'], ['greece', 'turkey'],

    // Italy + Mediterranean
    ['italy', 'libya'], ['italy', 'tunisia'], ['italy', 'greece'],

    // North Africa
    ['morocco', 'algeria'], ['algeria', 'tunisia'], ['tunisia', 'libya'],
    ['libya', 'egypt'],
];
const WW2_ADJACENCY = {};
for (const [a, b] of WW2_ADJACENCY_RAW) {
    (WW2_ADJACENCY[a] = WW2_ADJACENCY[a] || []).push(b);
    (WW2_ADJACENCY[b] = WW2_ADJACENCY[b] || []).push(a);
}

// ---------- Game ----------
const WW2_PLAYER_NATION = 'uk';

class EuropeWar {
    constructor() {
        this.mapEl = document.getElementById('ww2-map');
        this.sidebarEl = document.getElementById('ww2-sidebar');
        this.turnEl = document.getElementById('ww2-turn');
        this.phaseEl = document.getElementById('ww2-phase');
        this.nationEl = document.getElementById('ww2-nation');
        this.logEl = document.getElementById('ww2-log');
        this.endTurnBtn = document.getElementById('ww2-end-turn');
        this.newGameBtn = document.getElementById('ww2-new-game');
        if (!this.mapEl) return;

        this.endTurnBtn.addEventListener('click', () => this.endTurn());
        this.newGameBtn.addEventListener('click', () => this.newGame());

        this.newGame();
    }

    newGame() {
        // Deep-clone the static data so unit counts can mutate per-game.
        this.territories = {};
        for (const [id, t] of Object.entries(WW2_TERRITORIES)) {
            this.territories[id] = {
                ...t,
                units: { ...(t.units || {}) },
            };
        }
        this.turn = 1;
        this.selected = null;
        this.phase = 'player'; // 'player' | 'axis' | 'allies' | 'ended'
        this.logEl.innerHTML = '';
        this.log(`🗓️ September 1939. You command the ${WW2_NATIONS[WW2_PLAYER_NATION].name}.`);
        this.log('Click a territory to see its garrison. Combat comes in the next build — for now you can explore the map.');
        this.nationEl.textContent = WW2_NATIONS[WW2_PLAYER_NATION].name;
        this.render();
    }

    render() {
        // Build SVG: one <path> per territory + a label <text>.
        // Keep a reference so click handlers can find territory by id.
        const parts = [];
        // Background (sea)
        parts.push('<rect x="0" y="0" width="1200" height="720" fill="#1e3a5f"/>');
        // Territory polygons.
        //
        // Two-pass render: fill pass first, then a "nation outline" pass that only draws
        // strokes on edges bordering a *different* nation. This makes same-nation
        // internal subdivisions (Leningrad/Moscow/Ukraine/Caucasus within USSR) visually
        // blend into one country, while still keeping them clickable as separate units.
        //
        // Pass 1: fills only, no stroke — same-nation adjacent territories need to blend
        // into one contiguous-looking country (e.g. USSR subdivisions). Fill contrast
        // against the dark-blue sea makes country edges visible on their own.
        for (const [id, t] of Object.entries(this.territories)) {
            const nation = WW2_NATIONS[t.nation];
            const colour = nation ? nation.color : '#888';
            parts.push(
                `<path data-id="${id}" class="ww2-terr" d="${t.path}" ` +
                `fill="${colour}" stroke="none" pointer-events="all"/>`
            );
        }
        // Pass 2: dark outline drawn on top of each territory, but only for territories
        // NOT sharing a nation with all their neighbours. Since we don't have per-edge
        // adjacency metadata, we draw the outline on territories whose nation appears
        // only once (i.e. not part of a multi-territory nation like USSR). That leaves
        // the internal USSR seams as only the thin pass-1 stroke, while UK/FR/DE etc.
        // get a crisp full outline.
        const nationTerritoryCount = {};
        for (const t of Object.values(this.territories)) {
            nationTerritoryCount[t.nation] = (nationTerritoryCount[t.nation] || 0) + 1;
        }
        for (const [id, t] of Object.entries(this.territories)) {
            if (nationTerritoryCount[t.nation] > 1) continue;
            parts.push(
                `<path d="${t.path}" fill="none" stroke="rgba(0,0,0,0.55)" ` +
                `stroke-width="1.2" stroke-linejoin="round" pointer-events="none"/>`
            );
        }
        // Labels (drawn above fills)
        for (const [id, t] of Object.entries(this.territories)) {
            const [lx, ly] = t.labelAt;
            parts.push(
                `<text class="ww2-label-text" x="${lx}" y="${ly}" text-anchor="middle" ` +
                `pointer-events="none">${t.name}</text>`
            );
            // Unit count under the label
            const total = this.unitTotal(t);
            if (total > 0) {
                parts.push(
                    `<text class="ww2-unit-count" x="${lx}" y="${ly + 13}" text-anchor="middle" ` +
                    `pointer-events="none">⚔ ${total}</text>`
                );
            }
        }
        this.mapEl.innerHTML = parts.join('\n');

        // Wire up territory clicks (event delegation would also work)
        this.mapEl.querySelectorAll('.ww2-terr').forEach(el => {
            el.addEventListener('click', (e) => {
                this.selectTerritory(e.currentTarget.getAttribute('data-id'));
            });
        });

        // Re-apply selection highlight if any
        if (this.selected) {
            const el = this.mapEl.querySelector(`[data-id="${this.selected}"]`);
            if (el) el.classList.add('selected');
        }

        this.turnEl.textContent = this.turn;
        this.phaseEl.textContent = this.phase === 'player' ? 'Your move' : this.phase;
    }

    selectTerritory(id) {
        this.selected = id;
        // Update highlight
        this.mapEl.querySelectorAll('.ww2-terr').forEach(el => el.classList.remove('selected'));
        const el = this.mapEl.querySelector(`[data-id="${id}"]`);
        if (el) el.classList.add('selected');
        this.renderSidebar(id);
    }

    renderSidebar(id) {
        const t = this.territories[id];
        if (!t) return;
        const nation = WW2_NATIONS[t.nation];
        const sideLabel = { axis: '☠️ Axis', allies: '🎖️ Allies', neutral: '⚪ Neutral' }[nation.side];
        const adj = (WW2_ADJACENCY[id] || []).map(nid => this.territories[nid].name).join(', ');
        const units = t.units || {};
        const unitList = Object.entries(units)
            .filter(([, n]) => n > 0)
            .map(([k, n]) => `<li>${this.unitIcon(k)} ${n} ${k}</li>`)
            .join('') || '<li class="ww2-none">No garrison</li>';

        this.sidebarEl.innerHTML = `
            <h3 class="ww2-sb-title">${t.name}</h3>
            <div class="ww2-sb-row"><span class="ww2-sb-label">Nation</span>
                <span class="ww2-sb-value" style="color:${nation.color}">${nation.name}</span></div>
            <div class="ww2-sb-row"><span class="ww2-sb-label">Side</span>
                <span class="ww2-sb-value">${sideLabel}</span></div>
            <div class="ww2-sb-row"><span class="ww2-sb-label">Type</span>
                <span class="ww2-sb-value">${t.capital ? '⭐ Capital' : (t.type || 'region')}</span></div>
            <div class="ww2-sb-section">Garrison</div>
            <ul class="ww2-sb-units">${unitList}</ul>
            <div class="ww2-sb-section">Borders</div>
            <p class="ww2-sb-adj">${adj || '—'}</p>
        `;
    }

    unitIcon(kind) {
        return { infantry: '🪖', tanks: '🛡️', aircraft: '✈️', ships: '🚢' }[kind] || '⚔️';
    }

    unitTotal(t) {
        const u = t.units || {};
        return (u.infantry || 0) + (u.tanks || 0) + (u.aircraft || 0) + (u.ships || 0);
    }

    endTurn() {
        this.turn += 1;
        this.log(`⏭️ End of turn ${this.turn - 1}. (AI turn stubbed — coming in the next build.)`);
        this.render();
    }

    log(msg) {
        const li = document.createElement('li');
        li.textContent = msg;
        this.logEl.prepend(li);
        // Cap log length
        while (this.logEl.children.length > 40) this.logEl.removeChild(this.logEl.lastChild);
    }
}

// Deferred init — wait until the WW2 tab becomes visible so SVG has layout.
(function boot() {
    let inst = null;
    const maybeInit = () => {
        if (inst) return;
        const page = document.getElementById('ww2');
        if (page && page.classList.contains('active')) inst = new EuropeWar();
    };
    // On load (in case the page is somehow already active)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', maybeInit);
    } else {
        maybeInit();
    }
    // Also init lazily when user first opens the tab
    const origSwitch = window.switchTab;
    window.switchTab = function (tabName) {
        if (typeof origSwitch === 'function') origSwitch(tabName);
        if (tabName === 'ww2') requestAnimationFrame(() => requestAnimationFrame(maybeInit));
    };
})();
