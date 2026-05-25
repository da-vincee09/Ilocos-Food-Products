(() => {
const SUPABASE_URL = "https://hlpikdpjjqzvzrwilrot.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CfdtPu53A9i0xdYqWTGqhw_uFf4YhN8";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const state = {
  session: null,
  activeModule: "dashboard",
  records: [],
  lookups: { employees: [], suppliers: [], delivery_vehicles: [] },
  editingId: null,
  pendingDelete: null,
  chart: null,
  childRows: []
};

const yesNo = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" }
];

const modules = {
  employees: {
    label: "Employees",
    table: "employees",
    search: ["first_name", "last_name", "role", "initials", "status"],
    filters: [{ key: "status", label: "Status", options: ["Active", "Inactive"] }],
    fields: [
      { key: "first_name", label: "First Name", type: "text", required: true },
      { key: "last_name", label: "Last Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text" },
      { key: "initials", label: "Initials", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], default: "Active" }
    ],
    columns: ["first_name", "last_name", "role", "initials", "status", "created_at"]
  },
  suppliers: {
    label: "Suppliers",
    table: "suppliers",
    search: ["supplier_name", "address", "contact_person", "contact_no", "status"],
    filters: [{ key: "status", label: "Status", options: ["Active", "Inactive"] }],
    fields: [
      { key: "supplier_name", label: "Supplier Name", type: "text", required: true },
      { key: "address", label: "Address", type: "textarea", wide: true },
      { key: "contact_person", label: "Contact Person", type: "text" },
      { key: "contact_no", label: "Contact No.", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], default: "Active" }
    ],
    columns: ["supplier_name", "address", "contact_person", "contact_no", "status", "created_at"]
  },
  delivery_vehicles: {
    label: "Delivery Vehicles",
    table: "delivery_vehicles",
    search: ["plate_no", "vehicle_type", "description", "status"],
    filters: [{ key: "status", label: "Status", options: ["Active", "Inactive"] }],
    fields: [
      { key: "plate_no", label: "Plate No.", type: "text", required: true },
      { key: "vehicle_type", label: "Vehicle Type", type: "text" },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], default: "Active" }
    ],
    columns: ["plate_no", "vehicle_type", "description", "status", "created_at"]
  },
  raw_material_receiving: {
    label: "Raw Materials Receiving",
    table: "raw_material_receiving",
    childTable: "raw_material_receiving_items",
    childForeignKey: "raw_material_receiving_id",
    search: ["scheduled_delivery_date", "receiving_date"],
    filters: [{ key: "supplier_id", label: "Supplier", lookup: "suppliers" }],
    fields: [
      { key: "supplier_id", label: "Supplier", type: "lookup", lookup: "suppliers", required: true },
      { key: "scheduled_delivery_date", label: "Scheduled Delivery Date", type: "date" },
      { key: "receiving_date", label: "Receiving Date", type: "date", required: true },
      { key: "delivery_vehicle_id", label: "Delivery Vehicle", type: "lookup", lookup: "delivery_vehicles" },
      { key: "qc_inspector_id", label: "QC Inspector", type: "lookup", lookup: "employees" }
    ],
    childFields: [
      { key: "time_received", label: "Time Received", type: "time" },
      { key: "raw_material", label: "Raw Material", type: "text", required: true },
      { key: "packaging_condition", label: "Packaging Condition", type: "select", options: ["Good", "Damaged"] },
      { key: "moisture_content", label: "Moisture Content", type: "text" },
      { key: "expiry_date", label: "Expiry Date", type: "date" },
      { key: "within_specs", label: "Within Specs", type: "select", options: yesNo },
      { key: "quantity", label: "Quantity", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Accepted", "Rejected", "Hold"] },
      { key: "inspector_employee_id", label: "Inspector", type: "lookup", lookup: "employees" },
      { key: "received_by_employee_id", label: "Received By", type: "lookup", lookup: "employees" },
      { key: "remarks", label: "Remarks", type: "textarea" }
    ],
    columns: ["supplier_id", "receiving_date", "delivery_vehicle_id", "qc_inspector_id", "created_at"]
  },
  delivery_truck_inspections: {
    label: "Delivery Truck Monitoring",
    table: "delivery_truck_inspections",
    search: ["inspection_date", "inspection_time", "inspector_initials", "corrective_action"],
    filters: [{ key: "sanitized", label: "Sanitized", options: ["Yes", "No"] }],
    fields: [
      { key: "delivery_vehicle_id", label: "Delivery Vehicle", type: "lookup", lookup: "delivery_vehicles", required: true },
      { key: "driver_employee_id", label: "Driver", type: "lookup", lookup: "employees" },
      { key: "checked_by_employee_id", label: "Checked By", type: "lookup", lookup: "employees" },
      { key: "inspection_date", label: "Inspection Date", type: "date", required: true },
      { key: "inspection_time", label: "Inspection Time", type: "time" },
      { key: "exterior_condition", label: "Exterior Condition", type: "select", options: ["Clean", "Needs Cleaning", "Damaged"] },
      { key: "interior_condition", label: "Interior Condition", type: "select", options: ["Clean", "Needs Cleaning", "Damaged"] },
      { key: "odor_condition", label: "Odor Condition", type: "select", options: ["None", "Present"] },
      { key: "pest_activity", label: "Pest Activity", type: "select", options: yesNo },
      { key: "sanitized", label: "Sanitized", type: "select", options: yesNo },
      { key: "maintenance_issues", label: "Maintenance Issues", type: "textarea", wide: true },
      { key: "corrective_action", label: "Corrective Action", type: "textarea", wide: true },
      { key: "inspector_initials", label: "Inspector Initials", type: "text" }
    ],
    columns: ["delivery_vehicle_id", "inspection_date", "inspection_time", "sanitized", "maintenance_issues", "corrective_action"]
  },
  pest_control_inspections: {
    label: "Pest Control",
    table: "pest_control_inspections",
    childTable: "pest_control_inspection_items",
    childForeignKey: "pest_control_inspection_id",
    search: ["inspection_date"],
    filters: [{ key: "inspector_employee_id", label: "Inspector", lookup: "employees" }],
    fields: [
      { key: "inspection_date", label: "Inspection Date", type: "date", required: true },
      { key: "inspector_employee_id", label: "Inspector", type: "lookup", lookup: "employees" }
    ],
    childFields: [
      { key: "inspection_area", label: "Inspection Area", type: "text", required: true },
      { key: "pest_activity_observed", label: "Pest Activity Observed", type: "select", options: yesNo },
      { key: "pest_type", label: "Pest Type", type: "text" },
      { key: "corrective_action_taken", label: "Corrective Action Taken", type: "textarea" },
      { key: "inspector_initials", label: "Inspector Initials", type: "text" },
      { key: "verified_by_employee_id", label: "Verified By", type: "lookup", lookup: "employees" }
    ],
    columns: ["inspection_date", "inspector_employee_id", "created_at"]
  },
  oil_temperature_records: {
    label: "Oil Temperature / Deep Frying",
    table: "oil_temperature_records",
    childTable: "oil_temperature_readings",
    childForeignKey: "oil_temperature_record_id",
    search: ["production_date", "batch_lot_no"],
    filters: [{ key: "operator_employee_id", label: "Operator", lookup: "employees" }],
    fields: [
      { key: "production_date", label: "Production Date", type: "date", required: true },
      { key: "batch_lot_no", label: "Batch/Lot No.", type: "text", required: true },
      { key: "operator_employee_id", label: "Operator", type: "lookup", lookup: "employees" }
    ],
    childFields: [
      { key: "reading_time", label: "Reading Time", type: "time", required: true },
      { key: "oil_temperature_c", label: "Oil Temperature C", type: "number", required: true },
      { key: "operator_initial", label: "Operator Initial", type: "text" },
      { key: "corrective_action", label: "Corrective Action", type: "textarea" },
      { key: "verified_by_employee_id", label: "Verified By", type: "lookup", lookup: "employees" }
    ],
    columns: ["production_date", "batch_lot_no", "operator_employee_id", "created_at"]
  },
  cleaning_sanitation_logs: {
    label: "Cleaning & Sanitation",
    table: "cleaning_sanitation_logs",
    search: ["log_date", "area_of_concern", "action_taken", "sanitizer_used"],
    filters: [{ key: "standard_met", label: "Standard Met", options: ["Yes", "No"] }],
    fields: [
      { key: "log_date", label: "Log Date", type: "date", required: true },
      { key: "log_time", label: "Log Time", type: "time" },
      { key: "area_of_concern", label: "Area of Concern", type: "text", required: true },
      { key: "standard_met", label: "Standard Met", type: "select", options: yesNo },
      { key: "action_taken", label: "Action Taken", type: "textarea", wide: true },
      { key: "sanitizer_used", label: "Sanitizer Used", type: "text" },
      { key: "performed_by_employee_id", label: "Performed By", type: "lookup", lookup: "employees" },
      { key: "checked_by_employee_id", label: "Checked By", type: "lookup", lookup: "employees" }
    ],
    columns: ["log_date", "log_time", "area_of_concern", "standard_met", "action_taken", "sanitizer_used"]
  },
  stock_management_records: {
    label: "Stock Management",
    table: "stock_management_records",
    childTable: "stock_management_items",
    childForeignKey: "stock_management_record_id",
    search: ["warehouse_location"],
    filters: [{ key: "checked_by_employee_id", label: "Checked By", lookup: "employees" }],
    fields: [
      { key: "warehouse_location", label: "Warehouse Location", type: "text", required: true },
      { key: "checked_by_employee_id", label: "Checked By", type: "lookup", lookup: "employees" }
    ],
    childFields: [
      { key: "stock_date", label: "Stock Date", type: "date", required: true },
      { key: "stock_time", label: "Stock Time", type: "time" },
      { key: "product_name", label: "Product Name", type: "text", required: true },
      { key: "batch_lot_no", label: "Batch/Lot No.", type: "text" },
      { key: "quantity_in_stock", label: "Quantity in Stock", type: "number" },
      { key: "expiry_date", label: "Expiry Date", type: "date" },
      { key: "storage_condition", label: "Storage Condition", type: "select", options: ["Good", "Needs Attention"] },
      { key: "fifo_fefo_followed", label: "FIFO/FEFO Followed", type: "select", options: yesNo },
      { key: "inspector_initials", label: "Inspector Initials", type: "text" },
      { key: "corrective_action", label: "Corrective Action", type: "textarea" }
    ],
    columns: ["warehouse_location", "checked_by_employee_id", "created_at"]
  }
};

const navItems = [
  ["dashboard", "Dashboard"],
  ["employees", "Employees"],
  ["suppliers", "Suppliers"],
  ["delivery_vehicles", "Delivery Vehicles"],
  ["raw_material_receiving", "Raw Materials Receiving"],
  ["delivery_truck_inspections", "Delivery Truck Monitoring"],
  ["pest_control_inspections", "Pest Control"],
  ["oil_temperature_records", "Oil Temperature / Deep Frying"],
  ["cleaning_sanitation_logs", "Cleaning & Sanitation"],
  ["stock_management_records", "Stock Management"],
  ["reports", "Reports"]
];

const printTemplates = {
  raw_material_receiving: {
    title: "MONITORING RECORD HANDLING AND RECEIVING OF RAW MATERIALS",
    docTitle: "MONITORING RECORD HANDLING AND RECEIVING OF RAW MATERIALS",
    orientation: "portrait",
    blankRows: 27,
    metaLines: [
      [["SUPPLIER'S NAME", "supplier_id"], ["APPROVED AGREED SCHEDULED DATE OF DELIVERY", "scheduled_delivery_date"]],
      [["RECEIVING DATE", "receiving_date"], ["DELIVERY VEHICHLE ID", "delivery_vehicle_id"]],
      [["QUALITY CONTROL INSPECTOR", "qc_inspector_id"]]
    ],
    child: true,
    columns: [
      ["TIME", "time_received"],
      ["RAW MATERIAL", "raw_material"],
      ["PACKAGING CONDITION (GOOD / DAMAGED)", "packaging_condition"],
      ["MOISTURE CONTENT / EXPIRY DATE", (row) => [row.moisture_content, row.expiry_date].filter(Boolean).join(" / ")],
      ["WITHIN SPECS? (YES / NO)", "within_specs"],
      ["QUANTITY", "quantity"],
      ["ACCEPTED / REJECTED", "status"],
      ["INSPECTOR INITIALS", "inspector_employee_id"],
      ["RECEIVED BY", "received_by_employee_id"]
    ],
    instructions: [
      "Record all deliveries of raw materials upon receipt.",
      "Inspect packaging condition and accept/reject accordingly.",
      "Check and document moisture content of glutinous corn, and expiry date for packaged goods.",
      "Inspect the raw material/s if within the firm's accepted specification.",
      "Maintain completed records for at least one year for audit and compliance purposes."
    ]
  },
  delivery_truck_inspections: {
    title: "MONITORING RECORD CLEANLINESS AND MAINTENANCE OF DELIVERY TRUCK",
    docTitle: "MONITORING RECORD CLEANLINESS AND MAINTENANCE OF DELIVERY TRUCK",
    orientation: "landscape",
    blankRows: 16,
    metaLines: [
      [["TRUCK PLATE NO.", "delivery_vehicle_id"], ["DRIVER NAME", "driver_employee_id"], ["CHECKED BY", "checked_by_employee_id"]]
    ],
    headerRows: [
      [
        { label: "DATE", rowspan: 2 },
        { label: "TIME", rowspan: 2 },
        { label: "TRUCK CONDITION", colspan: 2 },
        { label: "Odor ( NORMAL / UNUSUAL )", rowspan: 2 },
        { label: "Pest Activity (YES / NO)", rowspan: 2 },
        { label: "Sanitized (YES / NO)", rowspan: 2 },
        { label: "Maintenance Issues (Yes/No)", rowspan: 2 },
        { label: "INSPECTOR INITIALS", rowspan: 2 },
        { label: "CORRECTIVE ACTION (IF ANY)", rowspan: 2 }
      ],
      [
        { label: "EXTERIOR (CLEAN / DIRTY)" },
        { label: "INTERIOR (CLEAN / DIRTY)" }
      ]
    ],
    columns: [
      ["DATE", "inspection_date"],
      ["TIME", "inspection_time"],
      ["EXTERIOR (CLEAN / DIRTY)", "exterior_condition"],
      ["INTERIOR (CLEAN / DIRTY)", "interior_condition"],
      ["ODOR (NORMAL / UNUSUAL)", "odor_condition"],
      ["PEST ACTIVITY (YES / NO)", "pest_activity"],
      ["SANITIZED (YES / NO)", "sanitized"],
      ["MAINTENANCE ISSUES (YES / NO)", "maintenance_issues"],
      ["INSPECTOR INITIALS", "inspector_initials"],
      ["CORRECTIVE ACTION (IF ANY)", "corrective_action"]
    ]
  },
  pest_control_inspections: {
    title: "MONITORING RECORD PEST CONTROL",
    docTitle: "MONITORING RECORD PEST CONTROL",
    orientation: "portrait",
    blankRows: 30,
    metaLines: [
      [["INSPECTION DATE", "inspection_date"], ["INSPECTOR'S NAME", "inspector_employee_id"]]
    ],
    child: true,
    columns: [
      ["INSPECTION AREA", "inspection_area"],
      ["PEST ACTIVITY OBSERVED (YES / NO)", "pest_activity_observed"],
      ["TYPE OF PEST (IF ANY)", "pest_type"],
      ["CORRECTIVE ACTION TAKEN", "corrective_action_taken"],
      ["INSPECTOR INITIALS", "inspector_initials"],
      ["VERIFIED BY (QA)", "verified_by_employee_id"]
    ],
    instructions: [
      "Conduct daily inspections and record any pest activity.",
      "If pests are observed, specify the type and describe corrective actions taken.",
      "The inspector must sign off on each entry.",
      "QA personnel must review and verify the log weekly.",
      "Maintain completed forms for at least one year for audit and compliance purposes."
    ]
  },
  oil_temperature_records: {
    title: "MONITORING RECORD - OIL TEMPERATURE IN DEEP FRYING",
    docTitle: "CCP MONITORING RECORD - DEEP FRYING",
    orientation: "portrait",
    blankRows: 30,
    metaLines: [
      [["Production Date", "production_date"], ["Batch/Lot No.", "batch_lot_no"], ["Operator's Name / ID No.", "operator_employee_id"]]
    ],
    child: true,
    columns: [
      ["TIME", "reading_time"],
      ["OIL TEMP. (C)", "oil_temperature_c"],
      ["OPERATOR INITIAL", "operator_initial"],
      ["CORRECTIVE ACTION (IF ANY)", "corrective_action"],
      ["VERIFIED BY QA", "verified_by_employee_id"]
    ],
    instructions: [
      "Record the oil temperature before deep frying.",
      "Enter the time, temperature reading, and operator's initials.",
      "If a deviation from the acceptable range (180 C to 190 C) occurs, describe the corrective action taken.",
      "QA personnel must verify and sign off on the monitoring record.",
      "Maintain completed forms for at least one year for audit and traceability purposes."
    ]
  },
  cleaning_sanitation_logs: {
    title: "CLEANING AND SANITATION LOG SHEET",
    docTitle: "MONITORING RECORD CLEANING AND SANITATION",
    orientation: "portrait",
    blankRows: 37,
    columns: [
      ["DATE", "log_date"],
      ["TIME", "log_time"],
      ["AREA OF CONCERN", "area_of_concern"],
      ["STANDARD (YES / NO)", "standard_met"],
      ["ACTION TAKEN", "action_taken"],
      ["SANITIZER USED", "sanitizer_used"],
      ["PERFORMED BY", "performed_by_employee_id"],
      ["CHECKED BY", "checked_by_employee_id"]
    ]
  },
  stock_management_records: {
    title: "MONITORING RECORD STOCK MANAGEMENT & CONTROL",
    docTitle: "MONITORING RECORD STOCK MANAGEMENT & CONTROL",
    orientation: "landscape",
    blankRows: 17,
    metaLines: [
      [["WAREHOUSE LOCATION", "warehouse_location"], ["CHECKED BY", "checked_by_employee_id"]]
    ],
    child: true,
    columns: [
      ["DATE", "stock_date"],
      ["TIME", "stock_time"],
      ["PRODUCT NAME", "product_name"],
      ["BATCH NO. / LOT NO.", "batch_lot_no"],
      ["QUANTITY IN STOCK", "quantity_in_stock"],
      ["EXPIRY DATE", "expiry_date"],
      ["STORAGE CONDITION (GOOD / NEEDS ATTENTION)", "storage_condition"],
      ["FIFO / FEFO FOLLOWED (YES / NO)", "fifo_fefo_followed"],
      ["INSPECTOR INITIALS", "inspector_initials"],
      ["CORRECTIVE ACTION (IF ANY)", "corrective_action"]
    ]
  }
};

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", init);

async function init() {
  renderNav();
  bindAuth();
  bindGlobalEvents();
  const { data } = await supabase.auth.getSession();
  state.session = data.session;
  supabase.auth.onAuthStateChange((_event, session) => {
    state.session = session;
    updateAuthView();
  });
  updateAuthView();
}

function bindAuth() {
  $("#show-login").addEventListener("click", () => switchAuth("login"));
  $("#show-register").addEventListener("click", () => switchAuth("register"));
  $("#login-form").addEventListener("submit", handleLogin);
  $("#register-form").addEventListener("submit", handleRegister);
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => togglePassword(button));
  });
}

function togglePassword(button) {
  const input = document.getElementById(button.dataset.togglePassword);
  if (!input) return;
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  button.classList.toggle("hidden-password", showing);
  button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
}

function bindGlobalEvents() {
  $("#logout-top").addEventListener("click", logout);
  $("#menu-toggle").addEventListener("click", () => toggleSidebar());
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("menu-open")) return;
    if (event.target.closest(".sidebar") || event.target.closest("#menu-toggle")) return;
    toggleSidebar(false);
  });
  document.querySelectorAll("[data-close-modal]").forEach((btn) => btn.addEventListener("click", closeModal));
  $("#cancel-delete").addEventListener("click", () => closeConfirm());
  $("#confirm-delete").addEventListener("click", performDelete);
}

function toggleSidebar(force) {
  const sidebar = $(".sidebar");
  const open = force ?? !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}

function switchAuth(mode) {
  $("#login-form").classList.toggle("hidden", mode !== "login");
  $("#register-form").classList.toggle("hidden", mode !== "register");
}

async function handleLogin(event) {
  event.preventDefault();
  setLoading(event.submitter, true);
  const email = $("#login-email").value.trim();
  const password = $("#login-password").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  setLoading(event.submitter, false);
  if (error) return showToast(error.message, "error");
  showToast("Logged in successfully.", "success");
}

async function handleRegister(event) {
  event.preventDefault();
  setLoading(event.submitter, true);
  const email = $("#register-email").value.trim();
  const password = $("#register-password").value;
  const { error } = await supabase.auth.signUp({ email, password });
  setLoading(event.submitter, false);
  if (error) return showToast(error.message, "error");
  showToast("Registration submitted. Check email confirmation if enabled.", "success");
  switchAuth("login");
}

async function logout() {
  await supabase.auth.signOut();
  showToast("Logged out.", "success");
}

async function updateAuthView() {
  const loggedIn = Boolean(state.session);
  $("#auth-view").classList.toggle("hidden", loggedIn);
  $("#app-view").classList.toggle("hidden", !loggedIn);
  if (!loggedIn) return;
  $("#user-email").textContent = state.session.user.email || "";
  await loadLookups();
  navigate(state.activeModule || "dashboard");
}

function renderNav() {
  $("#sidebar-nav").innerHTML = navItems.map(([key, label]) => (
    `<button class="nav-btn" type="button" data-nav="${key}">${escapeHtml(label)}</button>`
  )).join("");
  $("#sidebar-nav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-nav]");
    if (!button) return;
    const key = button.dataset.nav;
    if (key === "logout") return logout();
    navigate(key);
    toggleSidebar(false);
  });
}

async function navigate(key) {
  state.activeModule = key;
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.nav === key));
  $("#dashboard-view").classList.toggle("hidden", key !== "dashboard");
  $("#module-view").classList.toggle("hidden", key === "dashboard" || key === "reports");
  $("#reports-view").classList.toggle("hidden", key !== "reports");
  $("#page-title").textContent = key === "dashboard" ? "Dashboard" : key === "reports" ? "Reports" : modules[key].label;
  if (key === "dashboard") return renderDashboard();
  if (key === "reports") return renderReports();
  return renderModule(key);
}

async function loadLookups() {
  const [employees, suppliers, vehicles] = await Promise.all([
    fetchRows("employees"),
    fetchRows("suppliers"),
    fetchRows("delivery_vehicles")
  ]);
  state.lookups.employees = employees;
  state.lookups.suppliers = suppliers;
  state.lookups.delivery_vehicles = vehicles;
}

async function fetchRows(table) {
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
  if (error) {
    showToast(`${table}: ${error.message}`, "error");
    return [];
  }
  return data || [];
}

async function insertRow(table, data) {
  const { data: inserted, error } = await supabase.from(table).insert(data).select().single();
  if (error) throw error;
  return inserted;
}

async function updateRow(table, id, data) {
  const { data: updated, error } = await supabase.from(table).update(data).eq("id", id).select().single();
  if (error) throw error;
  return updated;
}

async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

async function renderDashboard() {
  const dash = $("#dashboard-view");
  dash.innerHTML = `<div class="panel"><strong>Loading dashboard...</strong></div>`;
  const tables = Object.values(modules).map((module) => module.table);
  const counts = {};
  await Promise.all(tables.map(async (table) => {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    counts[table] = error ? 0 : count;
  }));

  const [truck, pestItems, oilReadings, rawItems, cleaning, stockItems] = await Promise.all([
    fetchRows("delivery_truck_inspections"),
    fetchRows("pest_control_inspection_items"),
    fetchRows("oil_temperature_readings"),
    fetchRows("raw_material_receiving_items"),
    fetchRows("cleaning_sanitation_logs"),
    fetchRows("stock_management_items")
  ]);

  const corrective = [
    ...truck.filter((r) => r.corrective_action || r.maintenance_issues),
    ...pestItems.filter((r) => r.corrective_action_taken),
    ...oilReadings.filter((r) => r.corrective_action),
    ...cleaning.filter((r) => r.action_taken),
    ...stockItems.filter((r) => r.corrective_action)
  ].length;
  const oilDeviations = oilReadings.filter((r) => oilStatus(Number(r.oil_temperature_c)) !== "Normal").length;
  const pestObservations = pestItems.filter((r) => String(r.pest_activity_observed).toLowerCase() === "yes").length;
  const damagedPackaging = rawItems.filter((r) => String(r.packaging_condition).toLowerCase() === "damaged").length;
  const maintenanceIssues = truck.filter((r) => r.maintenance_issues).length;

  const cards = [
    ["Total Employees", counts.employees],
    ["Total Suppliers", counts.suppliers],
    ["Total Delivery Vehicles", counts.delivery_vehicles],
    ["Total Raw Material Receiving Records", counts.raw_material_receiving],
    ["Total Delivery Truck Inspections", counts.delivery_truck_inspections],
    ["Total Pest Control Records", counts.pest_control_inspections],
    ["Total Oil Temperature Records", counts.oil_temperature_records],
    ["Total Cleaning Logs", counts.cleaning_sanitation_logs],
    ["Total Stock Management Records", counts.stock_management_records]
  ];

  dash.innerHTML = `
    <section class="dashboard-hero">
      <div>
        <p class="eyebrow">Food Safety Command Center</p>
        <h3>SSOP Monitoring Overview</h3>
        <p>Track sanitation records, receiving checks, equipment hygiene, pest activity, frying temperatures, and warehouse controls in one place.</p>
      </div>
      <div class="hero-metrics">
        <span>${corrective}</span>
        <small>records needing attention</small>
      </div>
    </section>
    <div class="dashboard-grid">
      ${cards.map(([label, value], index) => `<article class="card metric-card metric-${index % 4}"><span>${label}</span><strong>${value || 0}</strong></article>`).join("")}
    </div>
    <div class="chart-row">
      <section class="panel">
        <div class="panel-header"><h3>Compliance Watch</h3></div>
        <div class="chart-shell">
          <canvas id="watch-chart"></canvas>
        </div>
      </section>
      <section class="panel attention-panel">
        <div class="panel-header"><h3>Records Needing Attention</h3></div>
        <div class="attention-list">
          <div class="attention-item"><span>Corrective action</span><strong class="status-badge warn">${corrective}</strong></div>
          <div class="attention-item"><span>Oil deviations</span><strong class="status-badge danger">${oilDeviations}</strong></div>
          <div class="attention-item"><span>Pest activity</span><strong class="status-badge danger">${pestObservations}</strong></div>
          <div class="attention-item"><span>Damaged packaging</span><strong class="status-badge warn">${damagedPackaging}</strong></div>
          <div class="attention-item"><span>Truck maintenance</span><strong class="status-badge warn">${maintenanceIssues}</strong></div>
        </div>
      </section>
    </div>
  `;
  if (window.Chart) {
    if (state.chart) state.chart.destroy();
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const labels = isMobile
      ? ["Corrective", "Oil", "Pest", "Packaging", "Truck"]
      : ["Corrective Actions", "Oil Deviations", "Pest Activity", "Damaged Packaging", "Truck Issues"];
    state.chart = new Chart($("#watch-chart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{ data: [corrective, oilDeviations, pestObservations, damagedPackaging, maintenanceIssues], backgroundColor: ["#c78a2c", "#b23a2f", "#9c6644", "#c9704a", "#556b2f"] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: isMobile ? "y" : "x",
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, ticks: { maxRotation: 0, autoSkip: false } },
          y: { beginAtZero: true, ticks: { autoSkip: false } }
        }
      }
    });
  }
}

async function renderModule(key) {
  const config = modules[key];
  const view = $("#module-view");
  view.innerHTML = `<div class="panel"><strong>Loading ${escapeHtml(config.label)}...</strong></div>`;
  await loadLookups();
  state.records = await fetchRows(config.table);
  if (config.childTable) {
    const children = await fetchRows(config.childTable);
    state.records = state.records.map((record) => ({
      ...record,
      _children: children.filter((child) => child[config.childForeignKey] === record.id)
    }));
  }
  view.innerHTML = `
    <div class="module-header">
      <div>
        <p class="eyebrow">Monitoring Module</p>
        <h3>${escapeHtml(config.label)}</h3>
      </div>
      <div class="module-tools">
        <button class="primary-btn" type="button" data-action="add">Add Record</button>
        <button class="ghost-btn" type="button" data-action="print-list">Print</button>
        <button class="secondary-btn" type="button" data-action="export">Export CSV</button>
      </div>
    </div>
    <div class="filters">
      <input id="module-search" type="search" placeholder="Search records">
      ${renderFilters(config)}
    </div>
    <div id="module-table"></div>
  `;
  view.querySelector("[data-action='add']").addEventListener("click", () => openModal(key));
  view.querySelector("[data-action='print-list']").addEventListener("click", () => printRecord(config.label, state.records, config));
  view.querySelector("[data-action='export']").addEventListener("click", () => exportCSV(`${config.table}.csv`, state.records));
  view.querySelector("#module-search").addEventListener("input", () => renderTable(key));
  view.querySelectorAll("[data-filter]").forEach((input) => input.addEventListener("change", () => renderTable(key)));
  renderTable(key);
}

function renderFilters(config) {
  return (config.filters || []).map((filter) => {
    const options = filter.lookup ? lookupOptions(filter.lookup) : (filter.options || []).map((value) => ({ value, label: value }));
    return `
      <select data-filter="${filter.key}">
        <option value="">All ${escapeHtml(filter.label)}</option>
        ${options.map((option) => `<option value="${escapeAttr(option.value)}">${escapeHtml(option.label)}</option>`).join("")}
      </select>
    `;
  }).join("");
}

function renderTable(key) {
  const config = modules[key];
  const search = ($("#module-search")?.value || "").toLowerCase();
  const filters = Array.from(document.querySelectorAll("[data-filter]")).map((el) => [el.dataset.filter, el.value]).filter(([, value]) => value);
  const rows = state.records.filter((record) => {
    const matchesSearch = !search || (config.search || config.columns).some((field) => String(displayValue(field, record[field])).toLowerCase().includes(search));
    const matchesFilters = filters.every(([field, value]) => String(record[field] || "") === value);
    return matchesSearch && matchesFilters;
  });
  const childHeader = config.childTable ? "<th>Child Rows</th>" : "";
  $("#module-table").innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${config.columns.map((column) => `<th>${labelize(column)}</th>`).join("")}
            ${childHeader}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((record) => renderRecordRow(record, config, key)).join("") : `<tr><td colspan="${config.columns.length + 2}">No records found.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  $("#module-table").querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => openModal(key, btn.dataset.edit)));
  $("#module-table").querySelectorAll("[data-delete]").forEach((btn) => btn.addEventListener("click", () => openConfirm(key, btn.dataset.delete)));
  $("#module-table").querySelectorAll("[data-print]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const record = state.records.find((item) => String(item.id) === btn.dataset.print);
      printRecord(config.label, [record], config);
    });
  });
}

function renderRecordRow(record, config, key) {
  const childCell = config.childTable ? `<td data-label="Child Rows">${renderChildSummary(record._children || [], config.childFields)}</td>` : "";
  return `
    <tr>
      ${config.columns.map((column) => `<td data-label="${labelize(column)}">${formatCell(column, record[column])}</td>`).join("")}
      ${childCell}
      <td data-label="Actions">
        <div class="row-actions">
          <button class="ghost-btn" type="button" data-edit="${record.id}">Edit</button>
          <button class="secondary-btn" type="button" data-print="${record.id}">Print</button>
          <button class="danger-btn" type="button" data-delete="${record.id}">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

function renderChildSummary(children, fields) {
  if (!children.length) return `<span class="status-badge warn">No child rows</span>`;
  return `
    <div class="child-table">
      ${children.map((child, index) => `
        <div><strong>Row ${index + 1}</strong>: ${fields.slice(0, 4).map((field) => `${escapeHtml(field.label)}: ${formatCell(field.key, child[field.key])}`).join(" | ")}</div>
      `).join("")}
    </div>
  `;
}

function openModal(key, id = null) {
  const config = modules[key];
  const record = id ? state.records.find((item) => String(item.id) === String(id)) : null;
  state.editingId = id;
  state.childRows = config.childTable ? structuredClone(record?._children || [{}]) : [];
  if (config.childTable && state.childRows.length === 0) state.childRows = [{}];
  $("#modal-kicker").textContent = config.label;
  $("#modal-title").textContent = id ? "Edit Record" : "Add Record";
  $("#record-form").innerHTML = `
    <div class="form-grid">
      ${config.fields.map((field) => renderField(field, record?.[field.key])).join("")}
    </div>
    ${config.childTable ? `<div class="panel child-editor"><div class="panel-header"><h3>Child Rows</h3><button class="secondary-btn" type="button" id="add-child">Add Child Row</button></div><div id="child-rows"></div></div>` : ""}
    <div class="modal-actions">
      <button class="ghost-btn" type="button" data-close-modal>Cancel</button>
      <button class="primary-btn" type="submit">Save Record</button>
    </div>
  `;
  $("#record-form").onsubmit = (event) => saveRecord(event, key);
  $("#record-form").querySelectorAll("[data-close-modal]").forEach((btn) => btn.addEventListener("click", closeModal));
  if (config.childTable) {
    $("#add-child").addEventListener("click", () => {
      state.childRows.push({});
      renderChildEditor(config);
    });
    renderChildEditor(config);
  }
  $("#record-modal").classList.remove("hidden");
}

function renderChildEditor(config) {
  $("#child-rows").innerHTML = state.childRows.map((row, index) => `
    <div class="child-row" data-child-index="${index}">
      ${config.childFields.map((field) => renderField(field, row[field.key], true)).join("")}
      <button class="danger-btn" type="button" data-remove-child="${index}">Remove</button>
    </div>
  `).join("");
  $("#child-rows").querySelectorAll("[data-remove-child]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.childRows.splice(Number(btn.dataset.removeChild), 1);
      if (state.childRows.length === 0) state.childRows.push({});
      renderChildEditor(config);
    });
  });
  $("#child-rows").querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", syncChildRows);
    input.addEventListener("change", syncChildRows);
  });
}

function syncChildRows() {
  document.querySelectorAll("[data-child-index]").forEach((rowEl) => {
    const index = Number(rowEl.dataset.childIndex);
    state.childRows[index] = readFormData(rowEl);
  });
}

function renderField(field, value = "", compact = false) {
  const actualValue = value ?? field.default ?? "";
  const wide = field.wide && !compact ? "wide" : "";
  const required = field.required ? "required" : "";
  const name = field.key;
  let input = "";
  if (field.type === "textarea") {
    input = `<textarea name="${name}" ${required}>${escapeHtml(actualValue)}</textarea>`;
  } else if (field.type === "select") {
    input = `<select name="${name}" ${required}><option value="">Select</option>${normalizeOptions(field.options).map((option) => `<option value="${escapeAttr(option.value)}" ${String(actualValue) === String(option.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select>`;
  } else if (field.type === "lookup") {
    input = `<select name="${name}" ${required}><option value="">Select</option>${lookupOptions(field.lookup).map((option) => `<option value="${escapeAttr(option.value)}" ${String(actualValue) === String(option.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select>`;
  } else {
    input = `<input name="${name}" type="${field.type}" value="${escapeAttr(actualValue)}" ${required} ${field.type === "number" ? "step=\"any\"" : ""}>`;
  }
  return `<label class="${wide}">${escapeHtml(field.label)}${input}</label>`;
}

async function saveRecord(event, key) {
  event.preventDefault();
  const config = modules[key];
  const submitter = event.submitter;
  setLoading(submitter, true);
  try {
    syncChildRows();
    const parentData = readFormData($("#record-form").querySelector(".form-grid"));
    validateRecord(config, parentData, state.childRows);
    const parent = state.editingId ? await updateRow(config.table, state.editingId, parentData) : await insertRow(config.table, parentData);
    if (config.childTable) {
      if (state.editingId) {
        const existing = await supabase.from(config.childTable).delete().eq(config.childForeignKey, state.editingId);
        if (existing.error) throw existing.error;
      }
      const children = state.childRows.map((row) => ({ ...cleanEmpty(row), [config.childForeignKey]: parent.id })).filter((row) => Object.values(row).some((value) => value !== "" && value !== null && value !== parent.id));
      if (children.length) {
        const { error } = await supabase.from(config.childTable).insert(children);
        if (error) throw error;
      }
    }
    closeModal();
    showToast("Record saved successfully.", "success");
    await renderModule(key);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(submitter, false);
  }
}

function validateRecord(config, _parentData, childRows) {
  if (config.table !== "oil_temperature_records") return;
  childRows.forEach((row, index) => {
    const temperature = Number(row.oil_temperature_c);
    if (Number.isFinite(temperature) && oilStatus(temperature) !== "Normal" && !String(row.corrective_action || "").trim()) {
      throw new Error(`Oil reading row ${index + 1} is ${oilStatus(temperature)}. Corrective action is required.`);
    }
  });
}

function readFormData(root) {
  const data = {};
  root.querySelectorAll("input, select, textarea").forEach((input) => {
    data[input.name] = input.type === "number" && input.value !== "" ? Number(input.value) : input.value || null;
  });
  return cleanEmpty(data);
}

function cleanEmpty(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === "" ? null : value]));
}

function closeModal() {
  $("#record-modal").classList.add("hidden");
  $("#record-form").reset();
  state.editingId = null;
  state.childRows = [];
}

function openConfirm(key, id) {
  state.pendingDelete = { key, id };
  $("#confirm-modal").classList.remove("hidden");
}

function closeConfirm() {
  state.pendingDelete = null;
  $("#confirm-modal").classList.add("hidden");
}

async function performDelete() {
  if (!state.pendingDelete) return;
  const { key, id } = state.pendingDelete;
  const config = modules[key];
  try {
    if (config.childTable) {
      const { error } = await supabase.from(config.childTable).delete().eq(config.childForeignKey, id);
      if (error) throw error;
    }
    await deleteRow(config.table, id);
    closeConfirm();
    showToast("Record deleted.", "success");
    await renderModule(key);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function renderReports() {
  $("#reports-view").innerHTML = `
    <div class="module-header">
      <div>
        <p class="eyebrow">Printable and Exportable</p>
        <h3>SSOP Reports</h3>
      </div>
      <div class="module-tools">
        <button class="ghost-btn" type="button" id="print-report">Print Report</button>
        <button class="secondary-btn" type="button" id="export-report">Export CSV</button>
      </div>
    </div>
    <div class="filters">
      <select id="report-type">
        ${Object.entries(modules).map(([key, config]) => `<option value="${key}">${escapeHtml(config.label)}</option>`).join("")}
      </select>
      <input id="report-start" type="date">
      <input id="report-end" type="date">
      <button id="run-report" class="primary-btn" type="button">Run Report</button>
    </div>
    <div id="report-results" class="panel">Choose filters, then run the report.</div>
  `;
  $("#run-report").addEventListener("click", runReport);
  $("#print-report").addEventListener("click", printReport);
  $("#export-report").addEventListener("click", () => exportCSV("ssop-report.csv", state.reportRows || []));
}

async function runReport() {
  const key = $("#report-type").value;
  const config = modules[key];
  const start = $("#report-start").value;
  const end = $("#report-end").value;
  let rows = await fetchRows(config.table);
  rows = rows.filter((row) => {
    const dateValue = row.inspection_date || row.receiving_date || row.production_date || row.log_date || row.created_at || "";
    return (!start || dateValue >= start) && (!end || dateValue <= end);
  });
  state.reportRows = rows;
  state.reportConfig = config;
  const nonCompliant = rows.filter((row) => isNonCompliant(row, config.table)).length;
  const corrective = rows.filter((row) => hasCorrective(row)).length;
  const pendingVerification = rows.filter((row) => Object.keys(row).some((keyName) => keyName.includes("verified_by") && !row[keyName])).length;
  $("#report-results").innerHTML = `
    <div class="print-shell">${officialPrintHeader("SSOP Monitoring Report")}${printTable(rows, config)}${signatureBlock()}</div>
    <div class="dashboard-grid">
      <article class="card"><span>Total Records</span><strong>${rows.length}</strong></article>
      <article class="card"><span>Compliant Records</span><strong>${rows.length - nonCompliant}</strong></article>
      <article class="card"><span>Non-Compliant Records</span><strong>${nonCompliant}</strong></article>
      <article class="card"><span>Corrective Actions</span><strong>${corrective}</strong></article>
      <article class="card"><span>Pending Verification</span><strong>${pendingVerification}</strong></article>
    </div>
    <div class="panel">
      <h3>Printable Report Layout</h3>
      <div class="table-wrap">${printTable(rows, config)}</div>
    </div>
  `;
}

function printReport() {
  const config = state.reportConfig || modules[$("#report-type")?.value || "employees"];
  const rows = state.reportRows || [];
  printRecord("SSOP Monitoring Report", rows, config);
}

function isNonCompliant(row, table) {
  if (table === "delivery_truck_inspections") return row.pest_activity === "Yes" || row.sanitized === "No" || Boolean(row.maintenance_issues);
  if (table === "cleaning_sanitation_logs") return row.standard_met === "No";
  return Object.values(row).some((value) => ["Damaged", "Rejected", "Hold", "No"].includes(String(value)));
}

function hasCorrective(row) {
  return Object.entries(row).some(([key, value]) => key.includes("corrective") && Boolean(value)) || Boolean(row.action_taken) || Boolean(row.maintenance_issues);
}

function exportCSV(filename, rows) {
  if (!rows.length) return showToast("No rows to export.", "warning");
  const flatRows = rows.map(({ _children, ...row }) => row);
  const headers = Object.keys(flatRows[0]);
  const csv = [
    headers.join(","),
    ...flatRows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function printRecord(title, rows, config) {
  const shell = document.createElement("div");
  shell.className = "print-shell";
  shell.innerHTML = printTemplates[config.table]
    ? printTemplateRecords(rows, config)
    : `${officialPrintHeader(title)}${printTable(rows, config)}${signatureBlock()}`;
  document.body.appendChild(shell);
  window.print();
  shell.remove();
}

function printTemplateRecords(rows, config) {
  const template = printTemplates[config.table];
  const records = rows.length ? rows : [{}];
  const printedOn = formatPrintDate(new Date());
  const pages = records.flatMap((record) => {
    const sourceRows = template.child ? (record._children || []) : [record];
    const displayRows = sourceRows.length ? sourceRows : [{}];
    const rowChunks = chunkRows(displayRows, template.blankRows ?? 10);
    return rowChunks.map((pageRows, pageIndex) => ({
      record,
      pageRows,
      pageNumber: pageIndex + 1,
      totalPages: rowChunks.length
    }));
  });
  return pages.map((page, index) => `
    <section class="template-print template-${template.orientation || "portrait"} ${index > 0 ? "page-break" : ""}">
      ${templateDocumentHeader(template, printedOn, page.pageNumber, page.totalPages)}
      <h1>${escapeHtml(template.title)}</h1>
      ${printTemplateMeta(page.record, template)}
      ${printTemplateTable(page.pageRows, template)}
      ${template.instructions?.length ? `<div class="template-instructions">
        <strong>Instructions:</strong>
        <ol>${template.instructions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
      </div>` : ""}
      ${templateDocumentFooter(printedOn)}
    </section>
  `).join("");
}

function templateDocumentHeader(template, dateText, pageNumber = 1, totalPages = 1) {
  return `
    <table class="template-doc-header">
      <tbody>
        <tr>
          <td class="header-logo" rowspan="4">IFP</td>
          <td class="header-company" colspan="5">ILOCOS FOOD PRODUCTS</td>
        </tr>
        <tr>
          <td class="header-company-sub" colspan="5">TALEB, BANTAY, ILOCOS SUR</td>
        </tr>
        <tr>
          <td class="header-ssop" colspan="5">SANITATION STANDARD OPERATING PROCEDURES (SSOP)</td>
        </tr>
        <tr>
          <td><strong>Document Code:</strong><br>0 / ${escapeHtml(formatDocumentCodeDate(dateText))}</td>
          <td><strong>Effectivity Date</strong><br>${escapeHtml(dateText)}</td>
          <td><strong>Revision No.</strong><br>0</td>
          <td><strong>Document Title:</strong><br>${escapeHtml(template.docTitle || template.title)}</td>
          <td><strong>Page</strong><br>${pageNumber} of ${totalPages}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function printTemplateMeta(record, template) {
  if (!template.metaLines?.length) return "";
  return `<div class="template-meta-lines">${template.metaLines.map((line) => `
    <div class="template-meta-line template-meta-${line.length}">
      ${line.map(([label, field]) => `
        <div class="template-field"><strong>${escapeHtml(label)}:</strong><span>${printValue(record, field)}</span></div>
      `).join("")}
    </div>
  `).join("")}</div>`;
}

function printTemplateTable(displayRows, template) {
  const headerRows = template.headerRows || [template.columns.map(([label]) => ({ label }))];
  const blankCount = Math.max(0, (template.blankRows ?? 10) - displayRows.length);
  return `
    <table class="template-table">
      <thead>
        ${headerRows.map((row) => `<tr>${row.map((cell) => `
          <th${cell.colspan ? ` colspan="${cell.colspan}"` : ""}${cell.rowspan ? ` rowspan="${cell.rowspan}"` : ""}>${escapeHtml(cell.label)}</th>
        `).join("")}</tr>`).join("")}
      </thead>
      <tbody>
        ${displayRows.map((row) => `<tr>${template.columns.map(([, field]) => `<td>${printValue(row, field)}</td>`).join("")}</tr>`).join("")}
        ${Array.from({ length: blankCount }, () => `<tr>${template.columns.map(() => "<td>&nbsp;</td>").join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function chunkRows(rows, size) {
  const chunks = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks.length ? chunks : [[{}]];
}

function printValue(row, field) {
  const value = typeof field === "function" ? field(row) : displayValue(field, row?.[field]);
  return escapeHtml(value || "");
}

function templateDocumentFooter(dateText) {
  return `
    <table class="template-doc-footer">
      <tbody>
        <tr>
          <td>Prepared &amp; Reviewed by:</td>
          <td>Approved by:</td>
        </tr>
        <tr>
          <td><strong>CATHERIN A. ALVIAR</strong></td>
          <td><strong>CLEMENCIA A. PADRE</strong></td>
        </tr>
        <tr>
          <td>Food Safety Compliance Officer</td>
          <td>Owner</td>
        </tr>
        <tr>
          <td>DATE: ${escapeHtml(dateText)}</td>
          <td>DATE: ${escapeHtml(dateText)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function formatPrintDate(date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDocumentCodeDate(dateText) {
  return dateText.toUpperCase().replace(",", "");
}

function officialPrintHeader(title) {
  const printedOn = formatPrintDate(new Date());
  return `
    <div class="print-header">
      <strong>Ilocos Food Products</strong><br>
      Taleb, Bantay, Ilocos Sur
      <h1>${escapeHtml(title)}</h1>
      <div>Sanitation Standard Operating Procedures (SSOP)</div>
      <div>Date: ${escapeHtml(printedOn)}</div>
    </div>
  `;
}

function printTable(rows, config) {
  const columns = config.columns || Object.keys(rows[0] || {});
  return `
    <table>
      <thead><tr>${columns.map((column) => `<th>${labelize(column)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.length ? rows.map((row) => `<tr>${columns.map((column) => `<td>${formatCell(column, row[column])}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}">No records available.</td></tr>`}
      </tbody>
    </table>
  `;
}

function signatureBlock() {
  return `
    <div class="signature-grid">
      <div class="signature-line">Prepared & Reviewed by:<br><strong>Catherin A. Alviar</strong><br>Food Safety Compliance Officer</div>
      <div class="signature-line">Approved by:<br><strong>Clemencia A. Padre</strong><br>Owner</div>
    </div>
  `;
}

function showToast(message, type = "success") {
  const toast = $("#toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.className = "toast", 3200);
}

function openModalAlias() {
  openModal(...arguments);
}

function closeModalAlias() {
  closeModal(...arguments);
}

function lookupOptions(name) {
  return (state.lookups[name] || []).map((item) => ({ value: item.id, label: lookupLabel(name, item) }));
}

function lookupLabel(name, item) {
  if (name === "employees") return `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.initials || item.id;
  if (name === "suppliers") return item.supplier_name || item.id;
  if (name === "delivery_vehicles") return item.plate_no || item.id;
  return item.id;
}

function displayValue(field, value) {
  if (!value) return "";
  if (field.endsWith("_employee_id") || field.includes("employee_id")) {
    const found = state.lookups.employees.find((item) => String(item.id) === String(value));
    return found ? lookupLabel("employees", found) : value;
  }
  if (field === "supplier_id") {
    const found = state.lookups.suppliers.find((item) => String(item.id) === String(value));
    return found ? lookupLabel("suppliers", found) : value;
  }
  if (field === "delivery_vehicle_id") {
    const found = state.lookups.delivery_vehicles.find((item) => String(item.id) === String(value));
    return found ? lookupLabel("delivery_vehicles", found) : value;
  }
  return value;
}

function formatCell(field, value) {
  const display = displayValue(field, value);
  if (field === "oil_temperature_c" && value !== null && value !== undefined) return `${escapeHtml(display)} <span class="status-badge ${oilStatus(Number(value)) === "Normal" ? "" : "danger"}">${oilStatus(Number(value))}</span>`;
  if (["status", "standard_met", "within_specs", "sanitized", "pest_activity", "pest_activity_observed", "fifo_fefo_followed"].includes(field)) {
    const danger = ["No", "Damaged", "Rejected", "Hold"].includes(String(display));
    return `<span class="status-badge ${danger ? "danger" : ""}">${escapeHtml(display || "-")}</span>`;
  }
  return escapeHtml(display || "-");
}

function oilStatus(value) {
  if (!Number.isFinite(value)) return "Normal";
  if (value < 180) return "Below Range";
  if (value > 190) return "Above Range";
  return "Normal";
}

function normalizeOptions(options = []) {
  return options.map((option) => typeof option === "string" ? { value: option, label: option } : option);
}

function labelize(text) {
  return escapeHtml(String(text).replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()));
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function setLoading(button, loading) {
  if (!button) return;
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = "Loading...";
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}

window.fetchRows = fetchRows;
window.insertRow = insertRow;
window.updateRow = updateRow;
window.deleteRow = deleteRow;
window.showToast = showToast;
window.renderTable = renderTable;
window.openModal = openModalAlias;
window.closeModal = closeModalAlias;
window.exportCSV = exportCSV;
window.printRecord = printRecord;
})();
