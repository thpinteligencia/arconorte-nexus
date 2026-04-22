import os
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from datetime import datetime
import io

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

class ReportingService:
    @staticmethod
    def generate_soja_report(uf_name: str, ncm: str, ipe: float, chart_data: list):
        """Gera um PDF do boletim estratégico usando WeasyPrint."""
        
        env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
        template = env.get_template("boletim.html")
        
        # Preparar dados para o template
        html_content = template.render(
            uf_name=uf_name,
            ncm=ncm,
            ipe=ipe,
            data=chart_data,
            date=datetime.now().strftime("%d/%m/%Y %H:%M")
        )
        
        # Converter para PDF em memória
        pdf_buffer = io.BytesIO()
        HTML(string=html_content).write_pdf(pdf_buffer)
        pdf_buffer.seek(0)
        
        return pdf_buffer
