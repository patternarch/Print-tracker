using System;
using System.Windows.Forms;
using System.Net.Http;
using System.Printing;
using System.Threading.Tasks;

namespace PrintTrackMonitor
{
    public partial class PrintMonitorForm : Form
    {
        private readonly HttpClient client;
        private const string API_URL = "http://your-printtrack-server:5000";

        public PrintMonitorForm()
        {
            InitializeComponent();
            client = new HttpClient();
            InitializePrintMonitor();
        }

        private void InitializeComponent()
        {
            this.Text = "PrintTrack Monitor";
            this.Width = 400;
            this.Height = 200;

            // Create job number input
            TextBox jobNumberInput = new TextBox
            {
                Location = new System.Drawing.Point(20, 20),
                Width = 200
            };

            // Create submit button
            Button submitButton = new Button
            {
                Text = "Validate Job",
                Location = new System.Drawing.Point(20, 50)
            };
            submitButton.Click += async (s, e) => await ValidateAndPrint(jobNumberInput.Text);

            // Add controls
            this.Controls.Add(jobNumberInput);
            this.Controls.Add(submitButton);
        }

        private async Task ValidateAndPrint(string jobNumber)
        {
            try
            {
                // Validate job number with API
                var response = await client.GetAsync($"{API_URL}/api/print-jobs/{jobNumber}");
                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Invalid job number. Please enter a valid print job number.");
                    return;
                }

                // If valid, allow print to proceed and log it
                await LogPrintJob(jobNumber);
                MessageBox.Show("Print job validated. Proceeding with print.");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}");
            }
        }

        private async Task LogPrintJob(string jobNumber)
        {
            try
            {
                var data = new
                {
                    jobNumber = jobNumber,
                    timestamp = DateTime.UtcNow,
                    computerName = Environment.MachineName
                };

                await client.PostAsync($"{API_URL}/api/print-logs", new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(data),
                    System.Text.Encoding.UTF8,
                    "application/json"
                ));
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to log print job: {ex.Message}");
            }
        }

        private void InitializePrintMonitor()
        {
            // Set up print spooler monitoring
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
            // Intercept new print jobs
            this.Invoke(new Action(() =>
            {
                MessageBox.Show("Please enter a job number to proceed with printing.");
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
