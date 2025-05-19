using System;
using System.Windows.Forms;
using System.Net.Http;
using System.Printing;
using System.Threading.Tasks;
using System.Drawing.Printing;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace PrintTrackMonitor
{
    public partial class PrintMonitorForm : Form
    {
        private readonly HttpClient client;
        private readonly string apiUrl;
        private Dictionary<string, decimal> paperCosts;

        public PrintMonitorForm()
        {
            InitializeComponent();
            client = new HttpClient();
            apiUrl = Environment.GetEnvironmentVariable("PRINTTRACK_API_URL") ?? "http://localhost:5000";
            InitializePrintMonitor();
            InitializePaperCosts();
        }

        private void InitializePaperCosts()
        {
            paperCosts = new Dictionary<string, decimal>
            {
                {"A0", 10.00m},  // Large format
                {"A1", 7.50m},   // Medium format
                {"A2", 5.00m},   // Small format
                {"A3", 2.50m},   // Detail drawings
                {"A4", 1.00m}    // Specifications
            };
        }

        private void InitializeComponent()
        {
            this.Text = "PrintTrack Professional";
            this.Width = 600;
            this.Height = 400;

            TableLayoutPanel mainLayout = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 2,
                RowCount = 5,
                Padding = new Padding(10)
            };

            // Job Information Section
            Label jobLabel = new Label { Text = "Print Job Number:" };
            TextBox jobNumberInput = new TextBox { Width = 200 };

            // Paper Settings Section
            ComboBox paperSizeCombo = new ComboBox
            {
                Items = { "A0", "A1", "A2", "A3", "A4" },
                SelectedIndex = 0
            };

            ComboBox paperTypeCombo = new ComboBox
            {
                Items = { "Bond", "Vellum", "Mylar", "Photo Quality" },
                SelectedIndex = 0
            };

            // Print Settings
            NumericUpDown copies = new NumericUpDown
            {
                Minimum = 1,
                Maximum = 100,
                Value = 1
            };

            CheckBox highQuality = new CheckBox
            {
                Text = "High Quality Print",
                Checked = true
            };

            // Cost Estimation
            Label costEstimate = new Label { Text = "Estimated Cost: $0.00" };

            // Version Control
            TextBox versionNotes = new TextBox
            {
                Multiline = true,
                Height = 60,
                PlaceholderText = "Enter version notes..."
            };

            // Submit Button
            Button submitButton = new Button
            {
                Text = "Validate and Print",
                Width = 150,
                Height = 30
            };

            // Event Handlers
            EventHandler updateCost = (s, e) =>
            {
                decimal baseCost = paperCosts[paperSizeCombo.SelectedItem.ToString()];
                decimal multiplier = paperTypeCombo.SelectedItem.ToString() == "Mylar" ? 1.5m : 1.0m;
                decimal totalCost = baseCost * multiplier * (decimal)copies.Value;
                costEstimate.Text = $"Estimated Cost: ${totalCost:F2}";
            };

            paperSizeCombo.SelectedIndexChanged += updateCost;
            paperTypeCombo.SelectedIndexChanged += updateCost;
            copies.ValueChanged += updateCost;

            submitButton.Click += async (s, e) => await ValidateAndPrint(new PrintJobDetails
            {
                JobNumber = jobNumberInput.Text,
                PaperSize = paperSizeCombo.SelectedItem.ToString(),
                PaperType = paperTypeCombo.SelectedItem.ToString(),
                Copies = (int)copies.Value,
                HighQuality = highQuality.Checked,
                VersionNotes = versionNotes.Text
            });

            // Layout
            mainLayout.Controls.Add(jobLabel, 0, 0);
            mainLayout.Controls.Add(jobNumberInput, 1, 0);
            mainLayout.Controls.Add(new Label { Text = "Paper Size:" }, 0, 1);
            mainLayout.Controls.Add(paperSizeCombo, 1, 1);
            mainLayout.Controls.Add(new Label { Text = "Paper Type:" }, 0, 2);
            mainLayout.Controls.Add(paperTypeCombo, 1, 2);
            mainLayout.Controls.Add(new Label { Text = "Copies:" }, 0, 3);
            mainLayout.Controls.Add(copies, 1, 3);
            mainLayout.Controls.Add(highQuality, 0, 4);
            mainLayout.Controls.Add(costEstimate, 1, 4);
            mainLayout.Controls.Add(new Label { Text = "Version Notes:" }, 0, 5);
            mainLayout.Controls.Add(versionNotes, 1, 5);
            mainLayout.Controls.Add(submitButton, 1, 6);

            this.Controls.Add(mainLayout);
        }

        private class PrintJobDetails
        {
            public string JobNumber { get; set; }
            public string PaperSize { get; set; }
            public string PaperType { get; set; }
            public int Copies { get; set; }
            public bool HighQuality { get; set; }
            public string VersionNotes { get; set; }
        }

        private async Task ValidateAndPrint(PrintJobDetails details)
        {
            try
            {
                // Validate job number with API
                var response = await client.GetAsync($"{apiUrl}/api/print-jobs/{details.JobNumber}");
                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Invalid job number. Please enter a valid print job number.");
                    return;
                }

                // Validate paper size for architectural drawings
                if (!IsValidPaperSize(details.PaperSize))
                {
                    MessageBox.Show("Selected paper size is not suitable for architectural drawings.");
                    return;
                }

                // Configure print quality
                PrintDocument printDoc = new PrintDocument();
                printDoc.DefaultPageSettings.PrinterResolution = new PrinterResolution
                {
                    Kind = details.HighQuality ?
                        PrinterResolutionKind.High :
                        PrinterResolutionKind.Medium
                };

                // Log print execution with extended details
                await LogPrintJob(details);

                MessageBox.Show("Print job validated. Proceeding with print.");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}");
            }
        }

        private bool IsValidPaperSize(string size)
        {
            // Validate paper size based on architectural standards
            return paperCosts.ContainsKey(size);
        }

        private async Task LogPrintJob(PrintJobDetails details)
        {
            try
            {
                var data = new
                {
                    jobNumber = details.JobNumber,
                    timestamp = DateTime.UtcNow,
                    computerName = Environment.MachineName,
                    paperSize = details.PaperSize,
                    paperType = details.PaperType,
                    copies = details.Copies,
                    highQuality = details.HighQuality,
                    versionNotes = details.VersionNotes,
                    estimatedCost = CalculateCost(details)
                };

                await client.PostAsync(
                    $"{apiUrl}/api/print-logs",
                    new StringContent(
                        System.Text.Json.JsonSerializer.Serialize(data),
                        System.Text.Encoding.UTF8,
                        "application/json"
                    )
                );
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to log print job: {ex.Message}");
            }
        }

        private decimal CalculateCost(PrintJobDetails details)
        {
            decimal baseCost = paperCosts[details.PaperSize];
            decimal typeMultiplier = details.PaperType == "Mylar" ? 1.5m : 1.0m;
            decimal qualityMultiplier = details.HighQuality ? 1.2m : 1.0m;
            return baseCost * typeMultiplier * qualityMultiplier * details.Copies;
        }

        private void InitializePrintMonitor()
        {
            try
            {
                var printServer = new LocalPrintServer();
                var queue = printServer.DefaultPrintQueue;
                queue.OnPrintJobAdded += Queue_OnPrintJobAdded;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to initialize print monitoring: {ex.Message}");
            }
        }

        private void Queue_OnPrintJobAdded(object sender, PrintJobEventArgs e)
        {
            this.Invoke(new Action(() =>
            {
                MessageBox.Show("New print job detected. Please enter job details to proceed.");
                this.Activate();
            }));
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new PrintMonitorForm());
        }
    }
}